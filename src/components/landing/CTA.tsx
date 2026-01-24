import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";

const CTA = () => {
  const { animationsEnabled } = useAnimation();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="scale">
          <div className="relative max-w-4xl mx-auto">
            {/* Background card */}
            <motion.div
              className="gradient-hero rounded-3xl p-12 md:p-16 text-center overflow-hidden relative"
              whileHover={animationsEnabled ? { scale: 1.01 } : undefined}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Decorative elements */}
              {animationsEnabled ? (
                <>
                  <motion.div
                    className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
                    animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"
                    animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              ) : (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                </>
              )}
              
              <div className="relative z-10">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                  whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm text-white/90">Start Your Journey Today</span>
                </motion.div>

                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                  Ready to Transform Your Creator Career?
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                  Take the first step towards building a sustainable creator career with 
                  tools designed to help you grow and monetize your content.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.div
                    whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                    whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                  >
                    <Button
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-xl shadow-xl"
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
                      className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                      asChild
                    >
                      <Link to="/contact">Talk to Us</Link>
                    </Button>
                  </motion.div>
                </div>

                <p className="text-white/60 text-sm mt-6">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTA;
