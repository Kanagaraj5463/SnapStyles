import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Lightbulb, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";

const values = [
  {
    icon: Target,
    title: "Creator-First",
    description: "Every feature we build starts with one question: how does this help creators succeed? Your growth is our mission.",
    color: "bg-accent",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "We're building more than a platform—we're building a community where creators support and inspire each other.",
    color: "bg-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We stay ahead of trends and continuously evolve our tools to give you the competitive edge you need.",
    color: "bg-yellow-500",
  },
  {
    icon: Rocket,
    title: "Your Success",
    description: "When you win, we win. We're invested in your journey and committed to helping you reach your goals.",
    color: "bg-purple-500",
  },
];

const Team = () => {
  const { animationsEnabled } = useAnimation();

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              What Drives Us
            </h2>
            <p className="text-muted-foreground text-lg">
              We're passionate about empowering creators to turn their passion into sustainable careers.
            </p>
          </div>
        </ScrollReveal>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction="scale">
              <motion.div
                whileHover={animationsEnabled ? { y: -5 } : undefined}
                className="h-full"
              >
                <Card className="border-border/50 text-center h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-8 pb-6 px-6">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-6`}
                      whileHover={animationsEnabled ? { scale: 1.1, rotate: 10 } : undefined}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <value.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="font-semibold text-lg text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mission statement */}
        <ScrollReveal delay={0.4}>
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-white"
              whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                To democratize creator success by providing accessible, powerful tools that help 
                anyone with a passion and a vision build a thriving digital presence and sustainable income.
              </p>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Team;
