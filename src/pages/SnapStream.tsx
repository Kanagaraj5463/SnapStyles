import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Smartphone, Bell, ArrowRight, Play, Zap, Users, Radio } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";

const features = [
  {
    icon: Video,
    title: "HD Live Streaming",
    description: "Crystal clear video quality that keeps your audience engaged",
  },
  {
    icon: Users,
    title: "Real-time Chat",
    description: "Interact with your viewers through live comments and reactions",
  },
  {
    icon: Zap,
    title: "Instant Go-Live",
    description: "Start streaming in seconds with our one-tap broadcasting",
  },
  {
    icon: Radio,
    title: "Multi-Platform",
    description: "Stream simultaneously to multiple platforms at once",
  },
];

const SnapStream = () => {
  const { animationsEnabled } = useAnimation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 gradient-hero" />
          
          {/* Floating elements */}
          {animationsEnabled && (
            <>
              <motion.div
                className="absolute top-1/4 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
          {!animationsEnabled && (
            <>
              <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </>
          )}
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <ScrollReveal>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              >
                <Radio className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm text-white/90">Live Streaming Feature</span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
                Snap<span className="text-accent">Stream</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
                Go live with your audience in stunning HD quality. Engage, entertain, and earn—all from one powerful platform.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div
                  whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                  whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                >
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-xl"
                    asChild
                  >
                    <Link to="/signup">
                      Start Streaming
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
                  >
                    <Play className="mr-2 w-5 h-5" />
                    See it in Action
                  </Button>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Features</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
                  Everything You Need to Go Live
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={animationsEnabled ? { y: -8, rotateZ: 1 } : undefined}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="pt-6">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4"
                          whileHover={animationsEnabled ? { scale: 1.1, rotate: 5 } : undefined}
                        >
                          <feature.icon className="w-7 h-7 text-accent" />
                        </motion.div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile App Announcement */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="scale">
              <Card className="max-w-3xl mx-auto overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <motion.div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium w-fit mb-4"
                      animate={animationsEnabled ? { scale: [1, 1.05, 1] } : undefined}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bell className="w-4 h-4" />
                      Coming Soon
                    </motion.div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                      SnapStream Mobile App
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Take your streams anywhere with our upcoming mobile app. Stream directly from your phone with all the professional features you love.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="gap-2" disabled>
                        <Smartphone className="w-4 h-4" />
                        iOS - Coming Soon
                      </Button>
                      <Button variant="outline" className="gap-2" disabled>
                        <Smartphone className="w-4 h-4" />
                        Android - Coming Soon
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-8 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      animate={animationsEnabled ? { y: [0, -10, 0] } : undefined}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-48 h-96 bg-foreground/10 rounded-[3rem] border-4 border-foreground/20 flex items-center justify-center">
                        <div className="text-center text-white/80">
                          <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Mobile Preview</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SnapStream;
