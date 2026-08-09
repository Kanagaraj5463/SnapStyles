import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clipboard, ShieldCheck, CalendarDays, CreditCard, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const TermsAndConditions = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              <ShieldCheck className="w-4 h-4" /> Terms & Conditions
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">The agreement that keeps your shoot experience smooth.</h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              These terms explain how SnapStyles works, what we expect from customers and creators, and how bookings are confirmed, rescheduled, or cancelled.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-10">
          <ScrollReveal>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-accent">
                  <ClipboardText className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">By using the SnapStyles website and booking services, you agree to these terms, our Privacy Policy, and any updates we publish.</p>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-accent">
                  <CalendarDays className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Shoot Bookings & Scheduling</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>Customers may request shoots through the booking flow. Confirmed bookings are scheduled in India Standard Time (IST) and displayed clearly before checkout.</p>
                  <p>All shoot details, including date, time, location and participant count, must be accurate at the time of booking.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-accent">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Payment & Refund Policy</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>Payments are collected securely through our payment providers. You will only see booking confirmed when payment succeeds.</p>
                  <p>Refunds and cancellations are handled in accordance with the cancellation policy specified during booking. Partial refunds may apply depending on timing and service preparation.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-accent">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Cancellation & Rescheduling</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>Customers may request rescheduling for upcoming shoots. Rescheduling is subject to availability and confirmation.</p>
                  <p>Cancellations must be made before the deadline specified in the booking flow. Cancellation and refund rights are governed by the policy displayed during checkout.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-accent">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Photography Rights & Content Usage</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>SnapStyles customers retain rights to the photos and videos they commission, subject to usage terms agreed with the photographer.</p>
                  <p>By submitting content or instructions, you grant us a license to use the material for service delivery, customer support, and improvements.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <h2 className="text-2xl font-semibold">Liability, Termination & Contact</h2>
                <p>SnapStyles works hard to deliver a premium shoot booking experience. We are not responsible for third-party service failures or events outside of our reasonable control.</p>
                <p>We may terminate access for misuse of the site or breach of these terms.</p>
                <p>For questions, contact <a href="mailto:snapstyles@gmail.com" className="text-accent hover:underline">snapstyles@gmail.com</a>.</p>
              </div>
            </motion.section>
          </ScrollReveal>

          <div className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-semibold mb-4">Key Terms at a Glance</h2>
            <div className="grid gap-4 text-sm text-muted-foreground leading-7">
              <div>
                <h3 className="font-semibold">Customer responsibilities</h3>
                <p>Provide accurate booking details, respond to confirmations, and arrive prepared for the scheduled shoot.</p>
              </div>
              <div>
                <h3 className="font-semibold">Service provider responsibilities</h3>
                <p>Deliver the shoot as described, communicate clearly, and follow safety and quality standards.</p>
              </div>
              <div>
                <h3 className="font-semibold">Changes to terms</h3>
                <p>We may update these terms. Continued use of the website indicates acceptance of any updates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsAndConditions;
