import { ChangeEvent, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SelfieSegmentation, Results as SegmentationResults } from "@mediapipe/selfie_segmentation";
import { Copy, FlipHorizontal2, ImagePlus, Instagram, MessageCircle, Music, Pause, Play, Radio, Search, Share2, SlidersHorizontal, Square, SwitchCamera, Users, X } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, LiveChat } from "@/components/stream/LiveChat";
import { getPeerConfiguration } from "@/lib/liveStream";
import { LiveReaction, ReactionBar, ReactionOverlay } from "@/components/stream/LiveReactions";
import { useAuth } from "@/contexts/AuthContext";
import { MusicState, SynchronizedMusic } from "@/components/stream/SynchronizedMusic";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface YouTubeResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

const musicSuggestions = [
  "Lo-fi beats",
  "Upbeat pop instrumental",
  "Chill acoustic",
  "Energetic workout music",
];

const LiveStudio = () => {
  const [title, setTitle] = useState("My SnapStyles Live");
  const [streamId, setStreamId] = useState("");
  const [sharePath, setSharePath] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [backgroundBlur, setBackgroundBlur] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [flipped, setFlipped] = useState(true);
  const [paused, setPaused] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const [customBackground, setCustomBackground] = useState("");
  const [music, setMusic] = useState<MusicState | null>(null);
  const [musicQuery, setMusicQuery] = useState("");
  const [musicResults, setMusicResults] = useState<YouTubeResult[]>([]);
  const [musicSearching, setMusicSearching] = useState(false);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<MediaStream | null>(null);
  const broadcastRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef(new Map<string, RTCPeerConnection>());
  const animationRef = useRef(0);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const segmentationMaskRef = useRef<CanvasImageSource | null>(null);
  const segmentationRef = useRef<SelfieSegmentation | null>(null);
  const segmentationRunningRef = useRef(false);
  const pausedRef = useRef(false);
  const peerConfigurationRef = useRef<RTCConfiguration>({});
  const effectsRef = useRef({ brightness, contrast, saturation, backgroundBlur, flipped });
  const { toast } = useToast();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    effectsRef.current = { brightness, contrast, saturation, backgroundBlur, flipped };
  }, [brightness, contrast, saturation, backgroundBlur, flipped]);

  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current);
    mediaRef.current?.getTracks().forEach((track) => track.stop());
    peersRef.current.forEach((peer) => peer.close());
    socketRef.current?.disconnect();
    segmentationRunningRef.current = false;
    segmentationRef.current?.close();
  }, []);

  const drawSource = (context: CanvasRenderingContext2D, source: CanvasImageSource, canvas: HTMLCanvasElement) => {
    context.save();
    if (effectsRef.current.flipped) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    context.restore();
  };

  const drawFrame = () => {
    const video = sourceVideoRef.current;
    const canvas = canvasRef.current;
    if (!pausedRef.current && video && canvas && video.readyState >= 2) {
      const context = canvas.getContext("2d");
      if (context) {
        const effects = effectsRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.filter = `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%)`;
        const mask = segmentationMaskRef.current;
        if (mask && (effects.backgroundBlur > 0 || backgroundImageRef.current)) {
          drawSource(context, mask, canvas);
          context.globalCompositeOperation = "source-in";
          drawSource(context, video, canvas);
          context.globalCompositeOperation = "destination-over";
          if (backgroundImageRef.current) {
            context.filter = "none";
            context.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            context.filter = `blur(${effects.backgroundBlur}px) brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%)`;
            drawSource(context, video, canvas);
          }
          context.globalCompositeOperation = "source-over";
        } else {
          drawSource(context, video, canvas);
        }
      }
    }
    animationRef.current = requestAnimationFrame(drawFrame);
  };

  const initializeSegmentation = () => {
    if (segmentationRef.current) return;
    const segmentation = new SelfieSegmentation({
      locateFile: (file) => `/mediapipe/selfie_segmentation/${file}`,
    });
    segmentation.setOptions({ modelSelection: 1, selfieMode: false });
    segmentation.onResults((results: SegmentationResults) => {
      segmentationMaskRef.current = results.segmentationMask;
    });
    segmentationRef.current = segmentation;
    segmentationRunningRef.current = true;
    const segmentFrame = async () => {
      if (!segmentationRunningRef.current) return;
      const video = sourceVideoRef.current;
      if (video?.readyState && (effectsRef.current.backgroundBlur > 0 || backgroundImageRef.current)) {
        await segmentation.send({ image: video });
      }
      window.setTimeout(segmentFrame, 66);
    };
    void segmentFrame();
  };

  const selectVirtualBackground = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Invalid background", description: "Choose an image up to 5 MB." });
      return;
    }
    if (customBackground) URL.revokeObjectURL(customBackground);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      backgroundImageRef.current = image;
      setCustomBackground(url);
    };
    image.src = url;
    event.target.value = "";
  };

  const clearVirtualBackground = () => {
    backgroundImageRef.current = null;
    if (customBackground) URL.revokeObjectURL(customBackground);
    setCustomBackground("");
  };

  const receiveReaction = (reaction: LiveReaction) => {
    setReactions((current) => [...current.slice(-9), reaction]);
    window.setTimeout(() => setReactions((current) => current.filter((item) => item.id !== reaction.id)), 3000);
  };

  const startLive = async () => {
    try {
      peerConfigurationRef.current = await getPeerConfiguration();
      const response = await fetch("/api/streams", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to create stream");

      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      mediaRef.current = media;
      if (sourceVideoRef.current) {
        sourceVideoRef.current.srcObject = media;
        await sourceVideoRef.current.play();
      }
      initializeSegmentation();
      drawFrame();
      const canvasStream = canvasRef.current!.captureStream(30);
      media.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
      broadcastRef.current = canvasStream;

      const socket = io({ withCredentials: true });
      socketRef.current = socket;
      socket.on("connect", () => socket.emit("stream:join", { streamId: payload.streamId, role: "broadcaster" }, (result: { error?: string }) => {
        if (result?.error) toast({ variant: "destructive", title: "Unable to go live", description: result.error });
      }));
      socket.on("stream:status", (status) => {
        setIsLive(status.live);
        setViewerCount(status.viewerCount);
      });
      socket.on("chat:message", (message: ChatMessage) => setMessages((current) => [...current.slice(-99), message]));
      socket.on("reaction:received", receiveReaction);
      socket.on("music:state", (state: MusicState | null) => setMusic(state));
      socket.on("webrtc:viewer-ready", async ({ viewerId }) => {
        const peer = new RTCPeerConnection(peerConfigurationRef.current);
        peersRef.current.set(viewerId, peer);
        broadcastRef.current?.getTracks().forEach((track) => peer.addTrack(track, broadcastRef.current!));
        peer.onicecandidate = (event) => {
          if (event.candidate) socket.emit("webrtc:ice", { targetId: viewerId, candidate: event.candidate });
        };

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("webrtc:offer", { viewerId, offer });
      });
      socket.on("webrtc:answer", async ({ viewerId, answer }) => {
        await peersRef.current.get(viewerId)?.setRemoteDescription(answer);
      });
      socket.on("webrtc:ice", async ({ senderId, candidate }) => {
        await peersRef.current.get(senderId)?.addIceCandidate(candidate);
      });
      setStreamId(payload.streamId);
      setSharePath(payload.sharePath);
      await refreshProfile();
      setIsLive(true);
      setHasStarted(true);
    } catch (error) {
      mediaRef.current?.getTracks().forEach((track) => track.stop());
      toast({ variant: "destructive", title: "Unable to start stream", description: error instanceof Error ? error.message : "Check camera and microphone permissions." });
    }
  };

  const endLive = () => {
    socketRef.current?.emit("stream:end");
    socketRef.current?.disconnect();
    peersRef.current.forEach((peer) => peer.close());
    peersRef.current.clear();
    mediaRef.current?.getTracks().forEach((track) => track.stop());
    cancelAnimationFrame(animationRef.current);
    setIsLive(false);
    setPaused(false);
    pausedRef.current = false;
  };

  const togglePaused = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    mediaRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !next;
    });
    setPaused(next);
  };

  const switchCamera = async () => {
    try {
      const nextFacingMode = facingMode === "user" ? "environment" : "user";
      const replacement = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextFacingMode }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } },
        audio: false,
      });
      const newVideoTrack = replacement.getVideoTracks()[0];
      const oldVideoTrack = mediaRef.current?.getVideoTracks()[0];
      const audioTracks = mediaRef.current?.getAudioTracks() || [];
      oldVideoTrack?.stop();
      mediaRef.current = new MediaStream([newVideoTrack, ...audioTracks]);
      if (sourceVideoRef.current) {
        sourceVideoRef.current.srcObject = mediaRef.current;
        await sourceVideoRef.current.play();
      }
      setFacingMode(nextFacingMode);
    } catch (error) {
      toast({ variant: "destructive", title: "Unable to switch camera", description: "A second camera was not found or camera access was denied." });
    }
  };

  const shareUrl = streamId ? `${window.location.origin}${sharePath}` : "";
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Live link copied" });
  };

  const shareLive = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: `Watch ${title} live on SnapStyles`, url: shareUrl });
      return;
    }
    await copyLink();
  };

  const shareToInstagram = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied", description: "Paste the link into your Instagram story or message." });
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const searchMusic = async (suggestedQuery?: string) => {
    const query = suggestedQuery || musicQuery;
    if (query.trim().length < 2) return;
    setMusicSearching(true);
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`, { credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to search YouTube");
      setMusicResults(payload.results);
    } catch (error) {
      toast({ variant: "destructive", title: "Music search unavailable", description: error instanceof Error ? error.message : "Try again later." });
    } finally {
      setMusicSearching(false);
    }
  };

  const selectMusic = (result: YouTubeResult) => {
    socketRef.current?.emit("music:set", { videoId: result.videoId, title: result.title });
    setMusicResults([]);
    setMusicQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-semibold text-red-400">Creator studio</p><h1 className="text-4xl font-bold">Go live in HD</h1></div>
          <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2"><Users className="h-4 w-4" />{viewerCount} watching</div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-2xl">
              <video ref={sourceVideoRef} muted playsInline className="hidden" />
              <canvas ref={canvasRef} width={1280} height={720} className="h-full w-full object-cover" />
              <ReactionOverlay reactions={reactions} />
              <div className="absolute left-3 top-3 z-30 rounded-full border border-white/20 bg-black/80 px-2 py-1 text-[10px] font-bold tracking-wide text-white shadow-lg">
                {isLive ? (
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>
                    LIVE
                  </span>
                ) : hasStarted ? <span className="text-slate-200">LIVE STOPPED</span> : "PREVIEW"}
              </div>
              <div className="absolute right-3 top-3 z-30 flex gap-1.5">
                {isLive && (
                  <>
                    <Button type="button" size="sm" className="h-7 border border-white/40 bg-black/70 px-2 text-[11px] text-white hover:bg-black hover:text-white" onClick={togglePaused}>
                      {paused ? <Play className="mr-1.5 h-3.5 w-3.5" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
                      {paused ? "Resume" : "Pause"}
                    </Button>
                    <Button type="button" size="sm" className="h-7 border border-white/40 bg-black/70 px-2 text-[11px] text-white hover:bg-black hover:text-white" onClick={switchCamera}>
                      <SwitchCamera className="mr-1.5 h-3.5 w-3.5" />{facingMode === "user" ? "Back" : "Front"}
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="h-7 border border-white/40 bg-black/70 px-2 text-[11px] text-white hover:bg-black hover:text-white"
                  onClick={() => setFlipped((current) => !current)}
                >
                  <FlipHorizontal2 className="mr-1.5 h-3.5 w-3.5" />Flip
                </Button>
              </div>
            </div>
            {!isLive ? (
              <Card className="border-slate-800 bg-slate-900 text-slate-100">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} className="bg-slate-950" />
                  <Button onClick={startLive} disabled={title.trim().length < 3} className="bg-red-500 text-white hover:bg-red-600"><Radio className="mr-2 h-4 w-4" />Start live stream</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <Input readOnly value={shareUrl} className="bg-slate-900 text-center text-sm" />
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button size="sm" className="h-8 border border-slate-500 bg-slate-800 px-3 text-xs text-white shadow-md hover:bg-slate-700 hover:text-white" onClick={copyLink}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy Link</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="h-8 border border-slate-500 bg-slate-800 px-3 text-xs text-white shadow-md hover:bg-slate-700 hover:text-white"><Share2 className="mr-1.5 h-3.5 w-3.5" />Share</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                      <DropdownMenuItem onClick={() => void shareLive()}><Share2 className="mr-2 h-4 w-4" />Share to an app</DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`https://wa.me/?text=${encodeURIComponent(`Watch ${title} live on SnapStyles: ${shareUrl}`)}`} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => void shareToInstagram()}><Instagram className="mr-2 h-4 w-4" />Instagram</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" className="h-8 bg-red-600 px-3 text-xs text-white hover:bg-red-700" onClick={endLive}><Square className="mr-1.5 h-3.5 w-3.5" />End Stream</Button>
                </div>
              </div>
            )}
            <ReactionBar socket={socketRef.current} disabled={!isLive} />
            <Card className="border-slate-800 bg-slate-900 text-white">
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Music className="h-5 w-5 text-red-400" />Live music</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <SynchronizedMusic music={music} socket={socketRef.current} creator />
                <div className="flex gap-2">
                  <Input value={musicQuery} onChange={(event) => setMusicQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void searchMusic(); }} placeholder="Search a song by name" className="bg-slate-950 text-white" />
                  <Button className="bg-slate-700 text-white hover:bg-slate-600" disabled={!isLive || musicSearching || musicQuery.trim().length < 2} onClick={() => void searchMusic()}>
                    <Search className="mr-2 h-4 w-4" />{musicSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="self-center text-xs font-semibold text-slate-400">Suggestions:</span>
                  {musicSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      size="sm"
                      className="h-7 border border-slate-600 bg-slate-800 px-2 text-xs text-white hover:bg-slate-700 hover:text-white"
                      disabled={!isLive || musicSearching}
                      onClick={() => {
                        setMusicQuery(suggestion);
                        void searchMusic(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
                {musicResults.length > 0 && (
                  <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                    {musicResults.map((result) => (
                      <button key={result.videoId} type="button" className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950 p-2 text-left text-white hover:border-red-400 hover:bg-slate-800" onClick={() => selectMusic(result)}>
                        <img src={result.thumbnail} alt="" className="h-14 w-20 rounded-lg object-cover" />
                        <span className="min-w-0"><span className="line-clamp-2 text-sm font-semibold">{result.title}</span><span className="mt-1 block truncate text-xs text-slate-400">{result.channelTitle}</span></span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900 text-slate-100">
              <CardHeader><CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-red-400" />Live video effects</CardTitle></CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                {[
                  ["Brightness", brightness, setBrightness, 50, 150],
                  ["Contrast", contrast, setContrast, 50, 150],
                  ["Color", saturation, setSaturation, 0, 200],
                ].map(([label, value, setter, min, max]) => (
                  <div key={label as string}><Label>{label as string}: {value as number}{label === "Soft blur" ? "px" : "%"}</Label><Slider className="mt-3" value={[value as number]} onValueChange={([next]) => (setter as (value: number) => void)(next)} min={min as number} max={max as number} step={1} /></div>
                ))}
                <div>
                  <Label>Background blur</Label>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Button type="button" size="sm" className={backgroundBlur === 0 ? "bg-red-500 text-white hover:bg-red-600" : "border border-slate-600 bg-slate-800 text-white hover:bg-slate-700"} onClick={() => setBackgroundBlur(0)}>Off</Button>
                    <Button type="button" size="sm" className={backgroundBlur === 8 ? "bg-red-500 text-white hover:bg-red-600" : "border border-slate-600 bg-slate-800 text-white hover:bg-slate-700"} onClick={() => setBackgroundBlur(8)}>Soft</Button>
                    <Button type="button" size="sm" className={backgroundBlur === 16 ? "bg-red-500 text-white hover:bg-red-600" : "border border-slate-600 bg-slate-800 text-white hover:bg-slate-700"} onClick={() => setBackgroundBlur(16)}>Strong</Button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">On-device person detection keeps you sharp while blurring only the background.</p>
                </div>
                <div className="sm:col-span-2">
                  <Label>Custom virtual background</Label>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button type="button" className="border border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white" asChild>
                      <label className="cursor-pointer">
                        <ImagePlus className="mr-2 h-4 w-4" />Choose image
                        <input type="file" accept="image/*" className="sr-only" onChange={selectVirtualBackground} />
                      </label>
                    </Button>
                    {customBackground && <Button type="button" className="border border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white" onClick={clearVirtualBackground}><X className="mr-2 h-4 w-4" />Remove</Button>}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Person detection replaces the background locally; the selected image is included in the transmitted video.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <LiveChat socket={socketRef.current} messages={messages} disabled={!isLive} />
        </div>
      </main>
    </div>
  );
};

export default LiveStudio;
