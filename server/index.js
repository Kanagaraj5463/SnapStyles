import "dotenv/config";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket, ObjectId } from "mongodb";
import { Server } from "socket.io";
import crypto from "node:crypto";
import { z } from "zod";

const { MONGODB_URI, JWT_SECRET, CLIENT_ORIGIN = "http://localhost:8080", TURN_URL, TURN_USERNAME, TURN_CREDENTIAL, YOUTUBE_API_KEY } = process.env;
const port = Number(process.env.API_PORT || 3001);

if (!MONGODB_URI) throw new Error("MONGODB_URI is required");
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    displayName: { type: String, required: true, trim: true, maxlength: 80 },
    bio: { type: String, default: "", maxlength: 500 },
    avatarUrl: { type: String, default: "", maxlength: 1000 },
    username: { type: String, unique: true, sparse: true, lowercase: true, trim: true, minlength: 3, maxlength: 30 },
    instagramUsername: { type: String, default: "", maxlength: 30 },
    verified: { type: Boolean, default: false, immutable: true },
    phone: { type: String, default: "", maxlength: 30 },
    address: {
      street: { type: String, default: "", maxlength: 120 },
      city: { type: String, default: "", maxlength: 80 },
      state: { type: String, default: "", maxlength: 80 },
      postalCode: { type: String, default: "", maxlength: 20 },
      country: { type: String, default: "", maxlength: 80 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});
const signupSchema = credentialsSchema.extend({
  displayName: z.string().trim().min(2).max(80),
});
const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(500),
  avatarUrl: z.union([
    z.literal(""),
    z.string().trim().url().max(1000),
    z.string().regex(/^\/api\/account\/avatar\/[a-f\d]{24}$/i),
  ]),
  username: z.union([
    z.literal(""),
    z.string().trim().toLowerCase().min(3).max(30).regex(/^[a-z0-9._]+$/, "Use only letters, numbers, periods, or underscores"),
  ]),
  instagramUsername: z.string().trim().max(30).regex(/^[A-Za-z0-9._]*$/, "Enter a valid Instagram username"),
  phone: z.string().trim().max(30),
  address: z.object({
    street: z.string().trim().max(120),
    city: z.string().trim().max(80),
    state: z.string().trim().max(80),
    postalCode: z.string().trim().max(20),
    country: z.string().trim().max(80),
  }),
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: CLIENT_ORIGIN, credentials: true } });
const liveStreams = new Map();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: "Too many authentication attempts. Please try again later." });
  },
});
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const serializeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  username: user.username || "",
  instagramUsername: user.instagramUsername,
  verified: user.verified,
  phone: user.phone,
  address: user.address,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  },
});

const avatars = () => new GridFSBucket(mongoose.connection.db, { bucketName: "avatars" });

const setSession = (res, user) => {
  const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("snapstyles_session", token, cookieOptions);
};

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.snapstyles_session;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Session is no longer valid" });
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Session is no longer valid" });
    }
    next(error);
  }
};

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/stream-config", (_req, res) => {
  const iceServers = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ];
  if (TURN_URL && TURN_USERNAME && TURN_CREDENTIAL) {
    iceServers.push({ urls: [TURN_URL], username: TURN_USERNAME, credential: TURN_CREDENTIAL });
  }
  res.json({ iceServers });
});

app.get("/api/youtube/search", requireAuth, async (req, res, next) => {
  try {
    if (!YOUTUBE_API_KEY) {
      return res.status(503).json({ message: "YouTube search is not configured. Add YOUTUBE_API_KEY to the server environment." });
    }
    const query = z.string().trim().min(2).max(100).parse(req.query.q);
    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      videoEmbeddable: "true",
      safeSearch: "strict",
      maxResults: "8",
      q: `${query} official audio`,
      key: YOUTUBE_API_KEY,
    });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    const payload = await response.json();
    if (!response.ok) {
      console.error("YouTube search failed:", payload?.error?.message || response.statusText);
      return res.status(502).json({ message: "YouTube search is temporarily unavailable" });
    }
    res.json({
      results: payload.items.map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      })),
    });
  } catch (error) {
    next(error);
  }
});

const createAvailableUsername = async (user) => {
  const preferred = (user.instagramUsername || user.email.split("@")[0])
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 24);
  const base = preferred.length >= 3 ? preferred : `creator${user._id.toString().slice(-6)}`;
  let candidate = base;
  let suffix = 1;
  while (await User.exists({ username: candidate, _id: { $ne: user._id } })) {
    candidate = `${base.slice(0, 25)}${suffix++}`;
  }
  user.username = candidate;
  await user.save();
  return candidate;
};

app.post("/api/streams", requireAuth, async (req, res, next) => {
  try {
  const streamId = crypto.randomBytes(9).toString("base64url");
  const title = z.string().trim().min(3).max(100).parse(req.body.title);
  const username = req.user.username || await createAvailableUsername(req.user);
  liveStreams.set(streamId, {
    id: streamId,
    title,
    ownerId: req.user._id.toString(),
    ownerName: req.user.displayName,
    username,
    live: false,
    broadcasterSocketId: null,
    viewerCount: 0,
    music: null,
  });
  res.status(201).json({ streamId, username, sharePath: `/live/${username}/${streamId}` });
  } catch (error) {
    next(error);
  }
});

app.get("/api/streams/:username/:streamId", (req, res) => {
  const stream = liveStreams.get(req.params.streamId);
  if (!stream || stream.username !== req.params.username.toLowerCase()) {
    return res.status(404).json({ message: "Live stream not found" });
  }
  res.json({
    id: stream.id,
    title: stream.title,
    ownerName: stream.ownerName,
    username: stream.username,
    live: stream.live,
    viewerCount: stream.viewerCount,
  });
});

app.post("/api/auth/signup", authLimiter, async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body);
    if (await User.exists({ email: input.email })) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const user = await User.create({
      email: input.email,
      displayName: input.displayName,
      passwordHash: await bcrypt.hash(input.password, 12),
    });
    setSession(res, user);
    res.status(201).json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/signin", authLimiter, async (req, res, next) => {
  try {
    const input = credentialsSchema.parse(req.body);
    const user = await User.findOne({ email: input.email }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    setSession(res, user);
    res.json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

app.post("/api/auth/signout", (_req, res) => {
  res.clearCookie("snapstyles_session", { ...cookieOptions, maxAge: undefined });
  res.status(204).end();
});

app.put("/api/account", requireAuth, async (req, res, next) => {
  try {
    const input = profileSchema.parse(req.body);
    Object.assign(req.user, input);
    if (!input.username) {
      await createAvailableUsername(req.user);
    } else {
      await req.user.save();
    }
    res.json({ user: serializeUser(req.user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/account/avatar", requireAuth, avatarUpload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Select a JPEG, PNG, or WebP image" });
    const previousAvatarId = req.user.avatarUrl.match(/^\/api\/account\/avatar\/([a-f\d]{24})$/i)?.[1];
    const uploadStream = avatars().openUploadStream(`${req.user._id}-profile`, {
      metadata: { userId: req.user._id, contentType: req.file.mimetype },
    });
    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(req.file.buffer);
    });
    req.user.avatarUrl = `/api/account/avatar/${uploadStream.id}`;
    await req.user.save();
    if (previousAvatarId) {
      avatars().delete(new ObjectId(previousAvatarId)).catch((error) => {
        console.error("Unable to remove previous profile image:", error);
      });
    }
    res.json({ user: serializeUser(req.user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/account/avatar/:imageId", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.imageId)) {
      return res.status(404).json({ message: "Profile image not found" });
    }
    const imageId = new ObjectId(req.params.imageId);
    const [image] = await avatars().find({ _id: imageId }).limit(1).toArray();
    if (!image) return res.status(404).json({ message: "Profile image not found" });
    res.set({
      "Content-Type": image.metadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    avatars().openDownloadStream(imageId).on("error", next).pipe(res);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: error.issues[0]?.message || "Invalid request" });
  }
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return res.status(409).json({ message: field === "username" ? "This username is already taken" : "An account with this email already exists" });
  }
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : error.message });
  }
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred" });
});

io.use(async (socket, next) => {
  try {
    const token = cookie.parse(socket.handshake.headers.cookie || "").snapstyles_session;
    if (!token) return next();
    const payload = jwt.verify(token, JWT_SECRET);
    socket.data.user = await User.findById(payload.sub);
    next();
  } catch {
    next();
  }
});

io.on("connection", (socket) => {
  let lastReactionAt = 0;
  socket.on("stream:join", ({ streamId, role }, acknowledge) => {
    const stream = liveStreams.get(streamId);
    if (!stream) return acknowledge?.({ error: "Live stream not found" });
    if (role === "broadcaster") {
      if (!socket.data.user || socket.data.user._id.toString() !== stream.ownerId) {
        return acknowledge?.({ error: "Only the stream owner can broadcast" });
      }
      stream.broadcasterSocketId = socket.id;
      stream.live = true;
      socket.data.streamRole = "broadcaster";
      socket.data.streamId = streamId;
      socket.join(streamId);
      io.to(streamId).emit("stream:status", { live: true, viewerCount: stream.viewerCount });
      if (stream.music) socket.emit("music:state", stream.music);
      return acknowledge?.({ ok: true });
    }
    socket.data.streamRole = "viewer";
    socket.data.streamId = streamId;
    socket.data.viewerName = socket.data.user?.displayName || `Guest ${socket.id.slice(0, 4)}`;
    socket.join(streamId);
    stream.viewerCount += 1;
    io.to(streamId).emit("stream:status", { live: stream.live, viewerCount: stream.viewerCount });
    if (stream.broadcasterSocketId) {
      io.to(stream.broadcasterSocketId).emit("webrtc:viewer-ready", { viewerId: socket.id });
    }
    if (stream.music) socket.emit("music:state", stream.music);
    acknowledge?.({ ok: true, live: stream.live });
  });

  socket.on("webrtc:offer", ({ viewerId, offer }) => {
    if (socket.data.streamRole === "broadcaster") io.to(viewerId).emit("webrtc:offer", { offer });
  });
  socket.on("webrtc:answer", ({ answer }) => {
    const stream = liveStreams.get(socket.data.streamId);
    if (socket.data.streamRole === "viewer" && stream?.broadcasterSocketId) {
      io.to(stream.broadcasterSocketId).emit("webrtc:answer", { viewerId: socket.id, answer });
    }
  });
  socket.on("webrtc:ice", ({ targetId, candidate }) => {
    if (targetId) {
      io.to(targetId).emit("webrtc:ice", { senderId: socket.id, candidate });
      return;
    }
    const stream = liveStreams.get(socket.data.streamId);
    if (socket.data.streamRole === "viewer" && stream?.broadcasterSocketId) {
      io.to(stream.broadcasterSocketId).emit("webrtc:ice", { senderId: socket.id, candidate });
    }
  });
  socket.on("chat:send", ({ message }) => {
    const text = typeof message === "string" ? message.trim().slice(0, 300) : "";
    if (!text || !socket.data.streamId) return;
    const name = socket.data.user?.displayName || socket.data.viewerName || "Host";
    io.to(socket.data.streamId).emit("chat:message", {
      id: crypto.randomUUID(),
      name,
      message: text,
      createdAt: new Date().toISOString(),
    });
  });
  socket.on("reaction:send", ({ type }) => {
    const reactions = {
      heart: { emoji: "💖", label: "Super Heart" },
    };
    const reaction = reactions[type];
    const now = Date.now();
    if (!reaction || !socket.data.streamId || now - lastReactionAt < 150) return;
    lastReactionAt = now;
    io.to(socket.data.streamId).emit("reaction:received", {
      id: crypto.randomUUID(),
      type,
      ...reaction,
      name: socket.data.user?.displayName || socket.data.viewerName || "Viewer",
      createdAt: new Date().toISOString(),
    });
  });
  socket.on("music:set", ({ videoId, title }) => {
    const stream = liveStreams.get(socket.data.streamId);
    if (socket.data.streamRole !== "broadcaster" || !stream || !/^[\w-]{11}$/.test(videoId)) return;
    stream.music = {
      videoId,
      title: typeof title === "string" ? title.slice(0, 150) : "YouTube Music",
      playing: true,
      position: 0,
      updatedAt: Date.now(),
    };
    io.to(stream.id).emit("music:state", stream.music);
  });
  socket.on("music:control", ({ action, position }) => {
    const stream = liveStreams.get(socket.data.streamId);
    if (socket.data.streamRole !== "broadcaster" || !stream?.music) return;
    const elapsed = stream.music.playing ? (Date.now() - stream.music.updatedAt) / 1000 : 0;
    const currentPosition = Math.max(0, Number.isFinite(position) ? position : stream.music.position + elapsed);
    if (action === "stop") {
      stream.music = null;
      io.to(stream.id).emit("music:state", null);
      return;
    }
    if (!["play", "pause", "seek"].includes(action)) return;
    stream.music = {
      ...stream.music,
      playing: action === "play" || (action === "seek" && stream.music.playing),
      position: currentPosition,
      updatedAt: Date.now(),
    };
    io.to(stream.id).emit("music:state", stream.music);
  });
  socket.on("stream:end", () => {
    const stream = liveStreams.get(socket.data.streamId);
    if (socket.data.streamRole !== "broadcaster" || !stream) return;
    stream.live = false;
    stream.broadcasterSocketId = null;
    io.to(stream.id).emit("stream:ended");
  });
  socket.on("disconnect", () => {
    const stream = liveStreams.get(socket.data.streamId);
    if (!stream) return;
    if (socket.data.streamRole === "viewer") {
      stream.viewerCount = Math.max(0, stream.viewerCount - 1);
    } else if (socket.data.streamRole === "broadcaster") {
      stream.live = false;
      stream.broadcasterSocketId = null;
      io.to(stream.id).emit("stream:ended");
    }
    io.to(stream.id).emit("stream:status", { live: stream.live, viewerCount: stream.viewerCount });
  });
});

await mongoose.connect(MONGODB_URI);
httpServer.listen(port, () => console.log(`SnapStyles API listening on http://localhost:${port}`));
