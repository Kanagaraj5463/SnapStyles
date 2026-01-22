import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Services from "@/components/landing/Services";
import CTA from "@/components/landing/CTA";

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
