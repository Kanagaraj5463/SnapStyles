import React from "react";
import { useAnimation } from "@/contexts/AnimationContext";
import { Sparkles } from "lucide-react";

export const AnimationToggle = () => {
  const { animationsEnabled, setAnimationsEnabled } = useAnimation();
  
  return (
    <button
      onClick={() => setAnimationsEnabled(!animationsEnabled)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        animationsEnabled 
          ? "bg-accent/20 text-accent border-accent/30" 
          : "bg-primary-foreground/10 text-primary-foreground/60 border-transparent"
      }`}
      aria-pressed={animationsEnabled}
    >
      <Sparkles className="w-3 h-3" />
      {animationsEnabled ? "Animations On" : "Animations Off"}
    </button>
  );
};
