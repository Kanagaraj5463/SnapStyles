import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Background card */}
          <div className="gradient-hero rounded-3xl p-12 md:p-16 text-center overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/90">Start Your Journey Today</span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Transform Your Creator Career?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of creators who are already using SnapStyles to grow their audience, 
                monetize their content, and build lasting success.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                  asChild
                >
                  <Link to="/contact">Talk to Us</Link>
                </Button>
              </div>

              <p className="text-white/60 text-sm mt-6">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
