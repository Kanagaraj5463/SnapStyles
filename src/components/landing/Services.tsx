import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, TrendingUp, DollarSign, Users, Zap, Shield } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Software Tools",
    description: "Powerful content management and scheduling tools designed specifically for creators. Streamline your workflow and save hours every week.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Social Media Growth",
    description: "Data-driven strategies and insights to help you grow your audience across all major platforms. Turn followers into a thriving community.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: DollarSign,
    title: "Monetization Enablement",
    description: "Multiple revenue streams from sponsorships to digital products. We help you transform your creativity into sustainable income.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Build and nurture your creator community with engagement tools and strategies that turn casual viewers into loyal supporters.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Zap,
    title: "Content Strategy",
    description: "Expert guidance on content planning, trending topics, and optimal posting times to maximize your reach and engagement.",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    icon: Shield,
    title: "Creator Support",
    description: "Dedicated support team and resources to help you navigate challenges and stay focused on what you do best—creating.",
    color: "bg-pink-500/10 text-pink-600",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-background" id="services">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg">
            From powerful tools to expert guidance, we provide the complete ecosystem for creator success.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6" />
                </div>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
