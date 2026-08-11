import { Link } from "react-router-dom";
import { Instagram, Send, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { AnimationToggle } from "./AnimationToggle";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1">
              <span className="font-display text-xl font-bold">
                Snap<span className="text-accent">Styles</span>
              </span>
              <Sparkles className="w-4 h-4 text-accent" />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Helping content creators grow, monetize, and succeed in the digital economy.
            </p>
            <div className="flex gap-4">
              <a
                href="https://t.me/snapstyles"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/snapstyles_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
              >
                Services
              </Link>
              <Link
                to="/snap-stream"
                className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
              >
                Snap Stream
              </Link>
              <Link
                to="/contact"
                className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <nav className="flex flex-col gap-3">
              <span className="text-primary-foreground/70 text-sm">Software Tools</span>
              <span className="text-primary-foreground/70 text-sm">Social Media Growth</span>
              <span className="text-primary-foreground/70 text-sm">Monetization Enablement</span>
              <span className="text-primary-foreground/70 text-sm">Creator Support</span>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} SnapStyles. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <Link
              to="/privacy-policy"
              className="text-primary-foreground/50 hover:text-accent transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-primary-foreground/50 hover:text-accent transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/support"
              className="text-primary-foreground/50 hover:text-accent transition-colors text-sm"
            >
              Support
            </Link>
            <Link
              to="/delete-account"
              className="text-primary-foreground/50 hover:text-accent transition-colors text-sm"
            >
              Delete Account
            </Link>
            <AnimationToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
