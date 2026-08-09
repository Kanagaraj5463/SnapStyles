import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle, CalendarDays, XCircle, CreditCard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I book a shoot?",
    answer: "Go to the Orders section, select Book a Shoot, choose your shoot type, date, time, location, and confirm the booking.",
  },
  {
    question: "Can I reschedule a shoot?",
    answer: "Yes. If your shoot is upcoming, open the order details and use the reschedule option to choose a new IST date and time.",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancellation details are shown while booking and in the Terms & Conditions. Requests can be submitted from the order details page.",
  },
  {
    question: "How do I contact support?",
    answer: "Use the Contact Support button on this page or visit Contact Us to send an email or call our helpline.",
  },
];

const Support = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              <HelpCircle className="w-4 h-4" /> Support
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">Need help booking your shoot?</h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Find answers, booking guidance, and quick access to our customer support team.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-8">
            <ScrollReveal>
              <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 text-accent mb-6">
                  <CalendarDays className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Booking Help</h2>
                </div>
                <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>Use the Orders page to schedule a shoot in IST. Choose a valid future date, time, location, and participant count.</p>
                  <p>All times are presented in India Standard Time (Asia/Kolkata) so your booking is always clear.</p>
                </div>
              </motion.section>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 text-accent mb-6">
                  <XCircle className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Cancellation & Rescheduling</h2>
                </div>
                <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>Reschedule your upcoming shoot from the order details page. A confirmation prompt will help avoid accidental changes.</p>
                  <p>When cancelling, you will see the policy details and can choose to keep the booking if needed.</p>
                </div>
              </motion.section>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 text-accent mb-6">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Payment Help</h2>
                </div>
                <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>Payments are completed during booking confirmation. If a payment fails, retry with a valid card or contact support.</p>
                  <p>Booking is only complete after payment success, and you will receive an order confirmation with the IST schedule.</p>
                </div>
              </motion.section>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 text-accent mb-6">
                  <MessageCircle className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Contact Support</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">If you need one-to-one assistance, our team is ready to help you finalize your shoot booking and answer questions about timing or cancellation.</p>
                <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </motion.section>
            </ScrollReveal>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 0.05}>
                <motion.article className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Support;
