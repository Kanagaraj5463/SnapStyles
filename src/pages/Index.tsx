import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Testimonials from "@/components/landing/Testimonials";
import Team from "@/components/landing/Team";
import CTA from "@/components/landing/CTA";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />

        <Services />

        {/* 🔥 SNAP LEVELS SECTION */}
        <section className="py-20 text-center relative overflow-hidden">
          {/* soft background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-yellow-500/5 to-black/0 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Snap Levels ⭐
            </h2>

            <p className="text-muted-foreground mb-8">
              From <strong>Creator</strong> to <strong>Crew</strong> to{" "}
              <strong>Pilot</strong> — explore the SnapStyles journey designed
              to help you grow, earn, and build a legacy.
            </p>

            <Link
              to="/creator-levels"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full
                         bg-gradient-to-r from-yellow-400 to-orange-500
                         text-black font-semibold shadow-lg
                         hover:scale-105 transition-transform"
            >
              Explore Snap Levels →
            </Link>
          </div>
        </section>

        <Testimonials />

        <Team />

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
