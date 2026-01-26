import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Content Creator",
    quote: "SnapStyles transformed how I manage my content. The tools are intuitive and the growth has been incredible.",
    rating: 5,
    initials: "AC",
  },
  {
    name: "Sarah Williams",
    role: "YouTuber",
    quote: "Finally, a platform that understands what creators actually need. My engagement has doubled since I started using it.",
    rating: 5,
    initials: "SW",
  },
  {
    name: "Marcus Johnson",
    role: "Digital Artist",
    quote: "The monetization features alone are worth it. I've been able to turn my passion into a sustainable income.",
    rating: 5,
    initials: "MJ",
  },
  {
    name: "Priya Patel",
    role: "Lifestyle Blogger",
    quote: "The community features helped me connect with other creators. It's not just a tool, it's a support system.",
    rating: 5,
    initials: "PP",
  },
  {
    name: "David Kim",
    role: "Podcast Host",
    quote: "Scheduling and analytics in one place. This platform saves me hours every week that I can now spend creating.",
    rating: 5,
    initials: "DK",
  },
];

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
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
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
              Testimonials
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              What Our Creators Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of creators who are already growing with SnapStyles
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials carousel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards container */}
          <div className="flex gap-6 justify-center flex-wrap lg:flex-nowrap">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1} direction="scale">
                <motion.div
                  whileHover={animationsEnabled ? { y: -8, scale: 1.02 } : undefined}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full sm:w-80"
                >
                  <Card className="border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 h-full bg-card/80 backdrop-blur-sm">
                    <CardContent className="pt-6 pb-6 px-6">
                      {/* Quote icon */}
                      <Quote className="w-8 h-8 text-accent/30 mb-4" />

                      {/* Rating */}
                      <div className="flex gap-0.5 mb-4">{renderStars(testimonial.rating)}</div>

                      {/* Quote */}
                      <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {testimonial.initials}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {testimonial.name}
                          </p>
                          <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex / 3) === idx
                    ? "bg-accent w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonials page ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-border/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">4.9/5</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">10,000+</p>
              <p className="text-sm text-muted-foreground">Happy Creators</p>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
