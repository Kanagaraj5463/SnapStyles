import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, TrendingUp, DollarSign, Users, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";

const services = [
  {
    icon: Monitor,
    title: "Software Tools",
    description:
      "Powerful content management and scheduling tools designed specifically for creators. Streamline your workflow and save hours every week.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Social Media Growth",
    description:
      "Data-driven strategies and insights to help you grow your audience across all major platforms. Turn followers into a thriving community.",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    icon: DollarSign,
    title: "Monetization Enablement",
    description:
      "Multiple revenue streams from sponsorships to digital products. We help you transform your creativity into sustainable income.",
    gradient: "from-accent to-cyan-400",
  },
  {
    icon: Users,
    title: "Community Building",
    description:
      "Build and nurture your creator community with engagement tools and strategies that turn casual viewers into loyal supporters.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Content Strategy",
    description:
      "Expert guidance on content planning, trending topics, and optimal posting times to maximize your reach and engagement.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Creator Support",
    description:
      "Dedicated support team and resources to help you navigate challenges and stay focused on what you do best—creating.",
    gradient: "from-primary to-accent",
  },
];

const Services = () => {
  const { animationsEnabled } = useAnimation();

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="services">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg">
              From powerful tools to expert guidance, we provide the complete ecosystem for creator
              success.
            </p>
          </div>
        </ScrollReveal>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={
                  animationsEnabled
                    ? {
                        y: -8,
                        transition: { type: "spring", stiffness: 300, damping: 20 },
                      }
                    : undefined
                }
                className="h-full"
              >
                <Card className="group border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 cursor-pointer h-full bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={animationsEnabled ? { scale: 1.1, rotate: 5 } : undefined}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
