import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Instagram, Send, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    type: "Pilot",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Former creator with 1M+ followers, now leading the mission to empower creators worldwide.",
    social: { instagram: "#", telegram: "#", linkedin: "#" },
  },
  {
    name: "Jordan Chen",
    role: "Head of Product",
    type: "Crew",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    bio: "Product visionary with 10+ years building tools that creators love.",
    social: { instagram: "#", telegram: "#", linkedin: "#" },
  },
  {
    name: "Sam Williams",
    role: "Growth Lead",
    type: "Crew",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Helped scale multiple creator-focused startups from 0 to millions of users.",
    social: { instagram: "#", telegram: "#", linkedin: "#" },
  },
  {
    name: "Taylor Martinez",
    role: "Community Manager",
    type: "Crew",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Building bridges between creators and turning our community into a family.",
    social: { instagram: "#", telegram: "#", linkedin: "#" },
  },
  {
    name: "Casey Thompson",
    role: "Creator Success",
    type: "Crew",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Dedicated to helping every creator achieve their monetization goals.",
    social: { instagram: "#", telegram: "#", linkedin: "#" },
  },
];

const Team = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Meet the Pilot & Crew
          </h2>
          <p className="text-muted-foreground text-lg">
            A passionate team of creators and tech experts dedicated to your success.
          </p>
        </div>

        {/* Team carousel */}
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {teamMembers.map((member, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="border-border/50 overflow-hidden group">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.type === "Pilot" 
                            ? "bg-accent text-white" 
                            : "bg-primary text-primary-foreground"
                        }`}>
                          {member.type}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                      <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {member.bio}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={member.social.instagram}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                          aria-label={`${member.name}'s Instagram`}
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                        <a
                          href={member.social.telegram}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                          aria-label={`${member.name}'s Telegram`}
                        >
                          <Send className="w-4 h-4" />
                        </a>
                        <a
                          href={member.social.linkedin}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Team;
