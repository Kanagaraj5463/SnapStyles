import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Testimonials from "@/components/landing/Testimonials";
import Team from "@/components/landing/Team";
import CTA from "@/components/landing/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Team />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
