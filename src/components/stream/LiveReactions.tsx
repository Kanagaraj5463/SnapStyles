import type { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

export interface LiveReaction {
  id: string;
  type: string;
  emoji: string;
  label: string;
  name: string;
}

const reactions = [{ type: "heart", emoji: "💖", label: "Super Heart" }];

export const ReactionBar = ({ socket, disabled }: { socket: Socket | null; disabled?: boolean }) => (
  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
    <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Send</span>
    {reactions.map((reaction) => (
      <Button
        key={reaction.type}
        type="button"
        variant="outline"
        disabled={disabled}
        className="h-auto rounded-xl border-slate-600 bg-slate-950 px-3 py-2 text-white hover:scale-110 hover:bg-slate-800 hover:text-white disabled:border-slate-800 disabled:bg-slate-900"
        onClick={() => socket?.emit("reaction:send", { type: reaction.type })}
        title={reaction.label}
      >
        <span className="text-2xl" aria-hidden>{reaction.emoji}</span>
        <span className="sr-only">{reaction.label}</span>
      </Button>
    ))}
  </div>
);

export const ReactionOverlay = ({ reactions: items }: { reactions: LiveReaction[] }) => (
  <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-live="polite">
    {items.map((reaction, index) => (
      <div
        key={reaction.id}
        className="absolute bottom-8 animate-[reaction-float_2.8s_ease-out_forwards]"
        style={{ left: `${12 + (index * 17) % 72}%` }}
      >
        <div className="rounded-full bg-black/60 px-3 py-2 text-center shadow-xl backdrop-blur">
          <div className="animate-bounce text-4xl">{reaction.emoji}</div>
          <p className="max-w-28 truncate text-xs font-semibold text-white">{reaction.name}</p>
        </div>
      </div>
    ))}
  </div>
);
