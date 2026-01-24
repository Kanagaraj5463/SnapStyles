import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";

const Hero = () => {
  const { animationsEnabled } = useAnimation();

  const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => {
    if (!animationsEnabled) return <div className={className} />;
    
    return (
      <motion.div
        className={className}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Floating decorative elements */}
      <FloatingShape 
        className="absolute top-1/4 left-[5%] w-32 h-32 bg-accent/20 rounded-full blur-2xl" 
        delay={0}
      />
      <FloatingShape 
        className="absolute top-1/3 right-[10%] w-24 h-24 bg-accent/30 rounded-full blur-xl" 
        delay={1}
      />
      <FloatingShape 
        className="absolute bottom-1/4 left-[15%] w-40 h-40 bg-white/5 rounded-full blur-2xl" 
        delay={2}
      />
      <FloatingShape 
        className="absolute bottom-1/3 right-[5%] w-56 h-56 bg-accent/10 rounded-full blur-3xl" 
        delay={0.5}
      />
      
      {/* Small floating icons */}
      {animationsEnabled && (
        <>
          <motion.div
            className="absolute top-[20%] left-[20%] text-accent/40"
            animate={{ y: [0, -15, 0], rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute top-[30%] right-[25%] text-white/20"
            animate={{ y: [0, 20, 0], rotate: [0, -360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-8 h-8" />
          </motion.div>
        </>
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <ScrollReveal delay={0.1}>
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white/90">Creator Platform for the Digital Age</span>
            </motion.div>
          </ScrollReveal>

          {/* Main headline */}
          <ScrollReveal delay={0.2}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Style that{" "}
              <span className="text-accent relative inline-block">
                Snaps!
                {animationsEnabled && (
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-accent/50 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                )}
              </span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal delay={0.3}>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Grow your audience, monetize your passion, and build a sustainable 
              career as a content creator with our powerful suite of tools.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
              >
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                  asChild
                >
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
                  asChild
                >
                  <Link to="/snap-stream">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Value propositions instead of fake stats */}
          <ScrollReveal delay={0.5}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-16 pt-8 border-t border-white/10">
              {[
                { icon: Zap, text: "Easy to Use" },
                { icon: Star, text: "Creator-First" },
                { icon: Sparkles, text: "Always Free to Start" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-white/70"
                  whileHover={animationsEnabled ? { scale: 1.05, color: "rgba(255,255,255,0.9)" } : undefined}
                >
                  <item.icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
