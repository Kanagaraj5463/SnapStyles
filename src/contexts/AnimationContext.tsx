import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AnimationContextProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const AnimationContext = createContext<AnimationContextProps | undefined>(undefined);

export const useAnimation = () => {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error("useAnimation must be used within AnimationProvider");
  return ctx;
};

const STORAGE_KEY = "animations-enabled";

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      // Check for user preference first
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === "true";
      }
      // Respect reduced motion preference
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(animationsEnabled));
  }, [animationsEnabled]);

  const setAnimationsEnabled = (enabled: boolean) => setAnimationsEnabledState(enabled);

  return (
    <AnimationContext.Provider value={{ animationsEnabled, setAnimationsEnabled }}>
      {children}
    </AnimationContext.Provider>
  );
};
