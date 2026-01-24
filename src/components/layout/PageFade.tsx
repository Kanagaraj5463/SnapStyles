import { useLocation } from "react-router-dom";
import { useAnimation } from "@/contexts/AnimationContext";
import { motion, AnimatePresence } from "framer-motion";
import React, { ReactNode } from "react";

export const PageFade = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { animationsEnabled } = useAnimation();
  const key = location.pathname;
  const duration = 0.35;

  if (!animationsEnabled) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
        style={{ height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
