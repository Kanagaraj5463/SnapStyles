import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AnimationLibrary = "framer-motion" | "react-transition-group";

interface AnimationContextProps {
  library: AnimationLibrary;
  setLibrary: (lib: AnimationLibrary) => void;
}

const AnimationContext = createContext<AnimationContextProps | undefined>(undefined);

export const useAnimation = () => {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error("useAnimation must be used within AnimationProvider");
  return ctx;
};

const STORAGE_KEY = "animation-library";

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [library, setLibraryState] = useState<AnimationLibrary>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(STORAGE_KEY) as AnimationLibrary) || "framer-motion";
    }
    return "framer-motion";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, library);
  }, [library]);

  const setLibrary = (lib: AnimationLibrary) => setLibraryState(lib);

  return (
    <AnimationContext.Provider value={{ library, setLibrary }}>
      {children}
    </AnimationContext.Provider>
  );
};
