import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useState, useEffect } from "react";

// Local image import
import rajuImage from "./raju.png";

const testimonials = [
  {
    name: "Raju",
    role: "Pilot",
    quote:
      "Welcome to our creator platform. It’s not just a platform, but a community that supports you end-to-end. Join us today and stay tuned for more updates.",
    // rating: 5,
    image: rajuImage,
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Testimonials = () => {
  const { animationsEnabled } = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !animationsEnabled) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, animationsEnabled]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Know about our Pilots & Crews
            </h2>
            {/* <p className="text-muted-foreground text-lg">
              Welcome to our creator platform — not just a platform, but a
              community to support you end-to-end.
            </p> */}
          </div>
        </ScrollReveal>

        {/* Testimonials carousel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-6 justify-center flex-wrap lg:flex-nowrap">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1} direction="scale">
                <motion.div
                  whileHover={
                    animationsEnabled
                      ? { y: -8, scale: 1.02 }
                      : undefined
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="w-full sm:w-80"
                >
                  <Card className="border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 h-full bg-card/80 backdrop-blur-sm">
                    <CardContent className="pt-6 pb-6 px-6">
                      <Quote className="w-8 h-8 text-accent/30 mb-4" />

                      <div className="flex gap-0.5 mb-4">
                        {renderStars(testimonial.rating)}
                      </div>

                      <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        {/* ✨ Golden glow avatar */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          {/* Glow ring */}
                          <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-md animate-pulse" />

                          {/* Avatar */}
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            {testimonial.image ? (
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-white text-sm font-semibold">
                                {getInitials(testimonial.name ?? "")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {testimonial.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
