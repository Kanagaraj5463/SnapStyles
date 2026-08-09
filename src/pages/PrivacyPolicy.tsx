import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Shield, FileText, Lock, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              <Shield className="w-4 h-4" /> Privacy Policy
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">Your privacy, protected with care.</h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              SnapStyles is committed to protecting the personal information you share while booking shoots and using our services.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-10">
          <ScrollReveal>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Information We Collect</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We collect only the information needed to support your shoot booking experience, deliver services, and keep your account secure.</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Contact details:</strong> name, email, phone number, and location information.</li>
                    <li><strong>Booking details:</strong> shoot type, date, time, number of people, location, and notes.</li>
                    <li><strong>Account data:</strong> profile details and authentication metadata.</li>
                    <li><strong>Device information:</strong> browser and device type, IP address, and usage data when you visit the website.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Mail className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">How We Use Your Data</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We use your information to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Process and manage shoot bookings.</li>
                    <li>Communicate booking confirmations, changes and support updates.</li>
                    <li>Improve our website experience and personalize our services.</li>
                    <li>Protect accounts through security monitoring and fraud prevention.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Lock className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Storage, Security & Sharing</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We retain personal data only as long as needed for service delivery and legal compliance.</p>
                  <p>Data is stored securely through our hosting provider and Supabase backend with encryption at rest and in transit.</p>
                  <p>We do not sell your personal information. We may share data with service providers that help us operate the website, process payments, and deliver shoot scheduling services.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Globe className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Your Rights</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>You can request access to or deletion of your account data at any time.</p>
                  <p>If you want to delete your account, please use the Account/Data Deletion page or contact us directly at <a href="mailto:snapstyles@gmail.com" className="text-accent hover:underline">snapstyles@gmail.com</a>.</p>
                  <p>We also honor your rights to update, correct, or restrict the processing of your personal information.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Policy Updates</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We may update this policy as our services evolve.</p>
                  <p>When changes occur, we will post the new Privacy Policy on this page and update the effective date.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <div className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy Summary</h2>
            <div className="grid gap-4 text-sm leading-7 text-muted-foreground">
              <div>
                <h3 className="font-semibold">Personal information</h3>
                <p>Includes name, email, phone, location, booking details, and account profile data.</p>
              </div>
              <div>
                <h3 className="font-semibold">Third-party services</h3>
                <p>We may use Supabase and payment processors to manage authentication, storage, and booking operations.</p>
              </div>
              <div>
                <h3 className="font-semibold">Data deletion</h3>
                <p>Use the Account/Data Deletion page to request removal of your account and associated personal information.</p>
              </div>
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p>Questions? Email <a href="mailto:snapstyles@gmail.com" className="text-accent hover:underline">snapstyles@gmail.com</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
