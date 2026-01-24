import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useAnimation } from "@/contexts/AnimationContext";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({ 
  children, 
  direction = "up", 
  delay = 0,
  className = ""
}: ScrollRevealProps) => {
  const { animationsEnabled } = useAnimation();

  const getInitialState = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -50 };
      case "right":
        return { opacity: 0, x: 50 };
      case "scale":
        return { opacity: 0, scale: 0.9 };
      case "up":
      default:
        return { opacity: 0, y: 40 };
    }
  };

  const getFinalState = () => {
    switch (direction) {
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "scale":
        return { opacity: 1, scale: 1 };
      case "up":
      default:
        return { opacity: 1, y: 0 };
    }
  };

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={getFinalState()}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
