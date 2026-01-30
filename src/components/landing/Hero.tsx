import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, TrendingUp, Globe, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const Hero = () => {
  const { animationsEnabled } = useAnimation();

  // Stats with animated counters
  const stats = [
    { icon: Users, value: 3, suffix: "+", label: "Creators" },
    { icon: TrendingUp, value: 50, suffix: "k+", label: "Total Reach" },
    { icon: Globe, value: 3, suffix: "+", label: "City" },
    { icon: Headphones, value: 24, suffix: "/7", label: "Support" },
  ];

  const StatCard = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
    const { ref, formattedCount } = useCountUp(stat.value, 2000, stat.suffix);
    const Icon = stat.icon;

    return (
      <motion.div
        ref={ref}
        className="glass rounded-2xl p-4 md:p-6 text-center min-w-[140px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 + index * 0.1 }}
        whileHover={animationsEnabled ? { scale: 1.05, y: -5 } : undefined}
      >
        <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
        <p className="text-2xl md:text-3xl font-bold text-white">{formattedCount}</p>
        <p className="text-white/70 text-sm">{stat.label}</p>
      </motion.div>
    );
  };

  const FloatingOrb = ({
    className,
    delay = 0,
  }: {
    className: string;
    delay?: number;
  }) => {
    if (!animationsEnabled) return <div className={className} />;
    return (
      <motion.div
        className={className}
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Animated background orbs */}
      <FloatingOrb
        className="absolute top-[10%] left-[5%] w-64 h-64 bg-accent/20 rounded-full blur-3xl"
        delay={0}
      />
      <FloatingOrb
        className="absolute top-[20%] right-[10%] w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl"
        delay={1}
      />
      <FloatingOrb
        className="absolute bottom-[20%] left-[15%] w-72 h-72 bg-teal-500/15 rounded-full blur-3xl"
        delay={2}
      />
      <FloatingOrb
        className="absolute bottom-[30%] right-[5%] w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
        delay={0.5}
      />

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main content */}
          <div className="text-center mb-12">
            {/* Badge */}
            <ScrollReveal delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8"
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-white/90">
                  Creator Platform for the Digital Age
                </span>
              </motion.div>
            </ScrollReveal>

            {/* Main headline */}
            <ScrollReveal delay={0.2}>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                Style that{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-300 relative inline-block">
                  Snaps!
                  {animationsEnabled && (
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent to-cyan-300 rounded-full"
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
                Grow your audience, monetize your passion, and build a sustainable career as a
                content creator with our powerful suite of tools.
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
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all shadow-glow"
                    asChild
                  >
                    <Link to="/signup">
                      Get Started 
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
                      Join the Crew!
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats Section */}
          <ScrollReveal delay={0.5}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
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
