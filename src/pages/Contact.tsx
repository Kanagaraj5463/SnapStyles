import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";
import ScrollReveal from "@/components/animations/ScrollReveal";

const Contact = () => {
  const { toast } = useToast();
  const { animationsEnabled } = useAnimation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "snapstyles@gmail.com",
      href: "mailto:snapstyles@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 999430546",
      href: "tel:+91999430546",
    },
    {
      icon: MapPin,
      label: "Country",
      value: "India",
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Send,
      label: "Telegram",
      href: "https://t.me/snapstyles",
      color: "hover:bg-blue-500",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/snapstyles_official",
      color: "hover:bg-pink-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
                Contact Us
              </h1>
              <p className="text-muted-foreground text-lg">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ScrollReveal delay={0.1} className="lg:col-span-2">
              <motion.div
                whileHover={animationsEnabled ? { y: -5 } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Your message..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                        <MessageCircle className="ml-2 w-4 h-4" />
                      </Button>
                      <div className="grid gap-3 sm:grid-cols-2 mt-4">
                        <a
                          href="mailto:snapstyles@gmail.com"
                          className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                        >
                          <Mail className="mr-2 h-4 w-4" /> Email Us
                        </a>
                        <a
                          href="tel:+91999430546"
                          className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
                        >
                          <Phone className="mr-2 h-4 w-4" /> Call Us
                        </a>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Details */}
              <ScrollReveal delay={0.2} direction="right">
                <motion.div
                  whileHover={animationsEnabled ? { y: -5 } : undefined}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {contactInfo.map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-4"
                          whileHover={animationsEnabled ? { x: 5 } : undefined}
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            {item.href ? (
                              <a href={item.href} className="font-medium hover:text-accent transition-colors">
                                {item.value}
                              </a>
                            ) : (
                              <p className="font-medium">{item.value}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>

              {/* Social Links */}
              <ScrollReveal delay={0.3} direction="right">
                <motion.div
                  whileHover={animationsEnabled ? { y: -5 } : undefined}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Follow Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        {socialLinks.map((social, index) => (
                          <motion.a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center transition-colors ${social.color} hover:text-white`}
                            aria-label={social.label}
                            whileHover={animationsEnabled ? { scale: 1.1, rotate: 5 } : undefined}
                            whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                          >
                            <social.icon className="w-5 h-5" />
                          </motion.a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
