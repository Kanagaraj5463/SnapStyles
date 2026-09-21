import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import type { Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface LiveChatProps {
  socket: Socket | null;
  messages: ChatMessage[];
  disabled?: boolean;
}

export const LiveChat = ({ socket, messages, disabled }: LiveChatProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || !socket) return;
    socket.emit("chat:send", { message: text });
    setMessage("");
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-800 p-4 font-semibold">
        <MessageCircle className="h-5 w-5 text-red-400" />Live chat
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-sm text-slate-400">Comments will appear here.</p>}
        {messages.map((item) => (
          <div key={item.id} className="rounded-xl bg-slate-950 p-3">
            <p className="text-xs font-semibold text-red-400">{item.name}</p>
            <p className="mt-1 break-words text-sm text-slate-200">{item.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-800 p-3">
        <Input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={300} disabled={disabled} placeholder="Write a comment..." />
        <Button size="icon" type="submit" disabled={disabled || !message.trim()} aria-label="Send comment">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
