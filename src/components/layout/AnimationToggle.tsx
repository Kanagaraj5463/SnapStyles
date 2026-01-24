import React from "react";
import { useAnimation } from "@/contexts/AnimationContext";

export const AnimationToggle = () => {
  const { library, setLibrary } = useAnimation();
  return (
    <div className="flex items-center gap-2 ml-4">
      <span className="text-xs text-primary-foreground/60">Animation:</span>
      <button
        className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${library === "framer-motion" ? "bg-accent text-accent-foreground border-accent" : "bg-primary-foreground/10 text-primary-foreground border-transparent"}`}
        onClick={() => setLibrary("framer-motion")}
        aria-pressed={library === "framer-motion"}
      >
        Framer Motion
      </button>
      <button
        className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${library === "react-transition-group" ? "bg-accent text-accent-foreground border-accent" : "bg-primary-foreground/10 text-primary-foreground border-transparent"}`}
        onClick={() => setLibrary("react-transition-group")}
        aria-pressed={library === "react-transition-group"}
      >
        React Transition Group
      </button>
      <span className="text-xs text-primary-foreground/80 font-bold ml-2">{library === "framer-motion" ? "Framer Motion Active" : "React Transition Group Active"}</span>
    </div>
  );
};