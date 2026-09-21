import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Music, Pause, Play, Square, Volume2 } from "lucide-react";

export interface MusicState {
  videoId: string;
  title: string;
  playing: boolean;
  position: number;
  updatedAt: number;
}

interface YouTubePlayer {
  loadVideoById(options: { videoId: string; startSeconds: number }): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  getCurrentTime(): number;
  unMute(): void;
  setVolume(volume: number): void;
  destroy(): void;
}

interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      height: string;
      width: string;
      playerVars: Record<string, number>;
      events: { onReady: (event: { target: YouTubePlayer }) => void };
    }
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeNamespace> | null = null;
const loadYouTubeApi = () => {
  if (window.YT) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return apiPromise;
};

interface SynchronizedMusicProps {
  music: MusicState | null;
  socket: Socket | null;
  creator?: boolean;
}

export const SynchronizedMusic = ({ music, socket, creator = false }: SynchronizedMusicProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const musicRef = useRef<MusicState | null>(music);
  const [ready, setReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(creator);

  const synchronize = (state: MusicState | null) => {
    const player = playerRef.current;
    if (!player) return;
    if (!state) {
      player.stopVideo();
      return;
    }
    const elapsed = state.playing ? (Date.now() - state.updatedAt) / 1000 : 0;
    const position = Math.max(0, state.position + elapsed);
    player.loadVideoById({ videoId: state.videoId, startSeconds: position });
    player.seekTo(position, true);
    if (state.playing) player.playVideo();
    else player.pauseVideo();
  };

  useEffect(() => {
    musicRef.current = music;
    if (ready) synchronize(music);
  }, [music, ready]);

  useEffect(() => {
    let player: YouTubePlayer | null = null;
    void loadYouTubeApi().then((YT) => {
      if (!containerRef.current) return;
      player = new YT.Player(containerRef.current, {
        height: "1",
        width: "1",
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: ({ target }) => {
            playerRef.current = target;
            target.setVolume(70);
            setReady(true);
          },
        },
      });
    });
    return () => player?.destroy();
  }, []);

  const control = (action: "play" | "pause" | "stop") => {
    socket?.emit("music:control", { action, position: playerRef.current?.getCurrentTime() || 0 });
  };

  const enableSound = () => {
    playerRef.current?.unMute();
    playerRef.current?.playVideo();
    setSoundEnabled(true);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white">
      <div ref={containerRef} className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden />
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-red-500/15 p-2 text-red-400"><Music className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">YouTube Music</p>
          <p className="truncate text-sm font-semibold">{music?.title || "No song selected"}</p>
        </div>
        {!creator && music && !soundEnabled && (
          <Button size="sm" className="bg-slate-700 text-white hover:bg-slate-600" onClick={enableSound}>
            <Volume2 className="mr-1.5 h-4 w-4" />Enable sound
          </Button>
        )}
      </div>
      {creator && music && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="bg-slate-700 text-white hover:bg-slate-600" onClick={() => control(music.playing ? "pause" : "play")}>
            {music.playing ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}{music.playing ? "Pause music" : "Play music"}
          </Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => control("stop")}>
            <Square className="mr-1.5 h-4 w-4" />Stop music
          </Button>
        </div>
      )}
    </div>
  );
};
