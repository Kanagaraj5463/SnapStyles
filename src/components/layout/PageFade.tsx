import { useLocation } from "react-router-dom";
import { useAnimation } from "@/contexts/AnimationContext";
import { motion, AnimatePresence } from "framer-motion";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import React, { ReactNode } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const PageFade = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { library } = useAnimation();
  const key = location.pathname;
  const duration = 0.35;
  const reduceMotion = prefersReducedMotion();

  if (reduceMotion) return <>{children}</>;

  if (library === "framer-motion") {
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
  }

  // React Transition Group
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={key}
        classNames="fade"
        timeout={duration * 1000}
        unmountOnExit
      >
        <div style={{ height: "100%" }}>{children}</div>
      </CSSTransition>
    </SwitchTransition>
  );
};

// Add fade CSS for RTG in global styles (tailwind or index.css):
// .fade-enter { opacity: 0; }
// .fade-enter-active { opacity: 1; transition: opacity 350ms; }
// .fade-exit { opacity: 1; }
// .fade-exit-active { opacity: 0; transition: opacity 350ms; }
