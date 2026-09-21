import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { Radio, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ChatMessage, LiveChat } from "@/components/stream/LiveChat";
import { getPeerConfiguration } from "@/lib/liveStream";
import { LiveReaction, ReactionBar, ReactionOverlay } from "@/components/stream/LiveReactions";
import { MusicState, SynchronizedMusic } from "@/components/stream/SynchronizedMusic";

interface StreamDetails { title: string; ownerName: string; live: boolean; viewerCount: number }

const LiveViewer = () => {
  const { username = "", streamId = "" } = useParams();
  const [details, setDetails] = useState<StreamDetails | null>(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const [streamEnded, setStreamEnded] = useState(false);
  const [music, setMusic] = useState<MusicState | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const peerConfigurationRef = useRef<RTCConfiguration>({});

  useEffect(() => {
    let activeSocket: Socket | null = null;
    Promise.all([fetch(`/api/streams/${username}/${streamId}`), getPeerConfiguration()])
      .then(async (response) => {
        const [detailsResponse, configuration] = response;
        const payload = await detailsResponse.json();
        if (!detailsResponse.ok) throw new Error(payload.message);
        peerConfigurationRef.current = configuration;
        setDetails(payload);
        activeSocket = io({ withCredentials: true });
        setSocket(activeSocket);
        activeSocket.on("connect", () => activeSocket?.emit("stream:join", { streamId, role: "viewer" }));
        activeSocket.on("stream:status", (status) => {
          if (status.live) setStreamEnded(false);
          setDetails((current) => current ? { ...current, ...status } : current);
        });
        activeSocket.on("stream:ended", () => {
          setStreamEnded(true);
          setDetails((current) => current ? { ...current, live: false } : current);
        });
        activeSocket.on("chat:message", (message: ChatMessage) => setMessages((current) => [...current.slice(-99), message]));
        activeSocket.on("reaction:received", (reaction: LiveReaction) => {
          setReactions((current) => [...current.slice(-9), reaction]);
          window.setTimeout(() => setReactions((current) => current.filter((item) => item.id !== reaction.id)), 3000);
        });
        activeSocket.on("music:state", (state: MusicState | null) => setMusic(state));
        activeSocket.on("webrtc:offer", async ({ offer }) => {
          const peer = new RTCPeerConnection(peerConfigurationRef.current);
          peerRef.current = peer;
          peer.ontrack = (event) => {
            if (videoRef.current) videoRef.current.srcObject = event.streams[0];
          };
          peer.onicecandidate = (event) => {
            if (event.candidate) activeSocket?.emit("webrtc:ice", { targetId: null, candidate: event.candidate });
          };
          await peer.setRemoteDescription(offer);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          activeSocket?.emit("webrtc:answer", { answer });
        });
        activeSocket.on("webrtc:ice", async ({ candidate }) => peerRef.current?.addIceCandidate(candidate));
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Unable to load stream"));
    return () => {
      activeSocket?.disconnect();
      peerRef.current?.close();
    };
  }, [streamId, username]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-24">
        {error ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><h1 className="text-2xl font-bold">{error}</h1><Button asChild className="mt-6"><Link to="/snap-stream">Explore SnapStream</Link></Button></div>
        ) : (
          <>
            <div className="mb-6"><div className="flex items-center gap-2 text-red-400"><Radio className="h-4 w-4" />SnapStream Live</div><h1 className="mt-2 text-3xl font-bold">{details?.title || "Loading stream..."}</h1><p className="text-slate-400">Hosted by {details?.ownerName}</p></div>
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div>
                <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-800 bg-black">
                  <video ref={videoRef} autoPlay playsInline controls className="h-full w-full object-contain" />
                  <ReactionOverlay reactions={reactions} />
                  <div className="absolute left-4 top-4 z-30 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg">
                    {details?.live ? (
                      <span className="flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" /></span>LIVE</span>
                    ) : streamEnded ? "LIVE STOPPED" : "WAITING FOR LIVE"}
                  </div>
                  {details?.live && (
                    <button
                      type="button"
                      className="absolute bottom-16 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-300 bg-pink-600 text-3xl text-white shadow-xl transition active:scale-90"
                      onClick={() => socket?.emit("reaction:send", { type: "heart" })}
                      aria-label="Send Super Heart"
                    >
                      💖
                    </button>
                  )}
                  {!details?.live && <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-center"><div><Radio className="mx-auto mb-3 h-10 w-10 text-slate-500" /><p className="text-xl font-semibold">{streamEnded ? "LIVE STOPPED" : "The host is currently offline"}</p><p className="mt-2 text-slate-400">{streamEnded ? "This live stream has ended." : "Keep this page open. Playback starts when they go live."}</p></div></div>}
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-400"><Users className="h-4 w-4" />{details?.viewerCount || 0} watching</p>
                <div className="mt-4"><ReactionBar socket={socket} disabled={!details?.live} /></div>
                <div className="mt-4"><SynchronizedMusic music={music} socket={socket} /></div>
              </div>
              <LiveChat socket={socket} messages={messages} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LiveViewer;
