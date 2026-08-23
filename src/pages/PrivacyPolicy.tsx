import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Shield, FileText, Lock, Globe, Sparkles, Camera, Users } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              <Shield className="w-4 h-4" /> iOS App Privacy Policy
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">SnapStyles Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              This policy explains how SnapStyles collects, uses, shares, and protects information when you use our iOS app, website, and related services.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">Effective date: August 23, 2026</p>
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
                  <p>We collect information you provide, information created while you use SnapStyles, and limited technical information needed to operate the service.</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li><strong>Account and profile information:</strong> name, email address, phone number, profile photo, biography, social links, and authentication information.</li>
                    <li><strong>Booking and transaction information:</strong> shoot type, date, time, location, participant count, notes, booking history, and payment status or transaction identifiers. Payment card details are handled by our payment provider and are not stored by SnapStyles.</li>
                    <li><strong>Photos and videos:</strong> media you choose to upload, capture, stream, or share through app features, together with related metadata.</li>
                    <li><strong>Communications:</strong> messages, support requests, feedback, and other information you send to us.</li>
                    <li><strong>Technical and usage information:</strong> device type, operating system, app version, IP address, crash information, and interactions with app features.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Camera className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">iOS Permissions</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>Depending on the features you use, SnapStyles may request access to device capabilities. You can manage these permissions at any time in iOS Settings.</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li><strong>Camera, microphone, and photo library:</strong> to capture, upload, stream, or share photos and videos you select.</li>
                    <li><strong>Location:</strong> to use your chosen booking location and help you discover nearby creators or services. Precise location is accessed only after you grant permission.</li>
                    <li><strong>Notifications:</strong> to send booking, collaboration, account, and service updates when you opt in.</li>
                  </ul>
                  <p>Denying a permission will not prevent you from using unrelated features, but the feature requiring that permission may not work.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Mail className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">How We Use Your Data</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We use your information to:</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Create, authenticate, and secure your account.</li>
                    <li>Provide profiles, bookings, collaboration, media, and customer-support features.</li>
                    <li>Process payments and communicate confirmations, changes, reminders, and service notices.</li>
                    <li>Maintain, troubleshoot, personalize, and improve SnapStyles.</li>
                    <li>Prevent fraud, abuse, security incidents, and violations of our terms.</li>
                    <li>Meet legal, accounting, and regulatory obligations.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Users className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">When We Share Information</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We do not sell your personal information. We share information only as needed with:</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Creators, photographers, businesses, or customers involved in a booking or collaboration you request.</li>
                    <li>Service providers that support authentication, hosting, data storage, payments, communications, analytics, crash reporting, and customer support. These providers may use information only to perform services for us.</li>
                    <li>Authorities or other parties when required by law, needed to protect rights and safety, or connected to a merger, acquisition, financing, or sale of business assets.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Lock className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Storage, Security & Retention</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>We use reasonable administrative, technical, and physical safeguards designed to protect personal information. Information may be processed and stored by SnapStyles and our service providers in India or other countries where they operate.</p>
                  <p>We retain information while your account is active and as needed to provide services. After deletion, we remove or de-identify information within a reasonable period unless retention is required for legal, accounting, fraud prevention, dispute resolution, or security purposes.</p>
                  <p>No method of electronic transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <motion.section className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Globe className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Your Rights</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>You may update certain profile information in SnapStyles, manage iOS permissions in Settings, and opt out of push notifications. Depending on where you live, you may also request access to, correction of, deletion of, or a copy of your personal information, or object to or restrict certain processing.</p>
                  <p>To request account and data deletion, visit our <Link to="/delete-account" className="font-medium text-accent hover:underline">Account/Data Deletion page</Link> or email <a href="mailto:snapstyles@gmail.com" className="font-medium text-accent hover:underline">snapstyles@gmail.com</a>. We may need to verify your identity before completing a request.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <motion.section className="rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">Children & Policy Updates</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>SnapStyles is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided information to us, please contact us so we can delete it.</p>
                  <p>We may update this policy as our app, services, or legal obligations change. We will post the revised policy here, update the effective date, and provide additional notice when required.</p>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <div className="rounded-3xl border border-border bg-background p-8 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-semibold mb-4">Additional iOS Disclosures</h2>
            <div className="grid gap-4 text-sm leading-7 text-muted-foreground">
              <div>
                <h3 className="font-semibold">Tracking and advertising</h3>
                <p>SnapStyles does not use data collected from the iOS app to track you across apps or websites owned by other companies. We do not use your precise location, photos, videos, or contacts for third-party advertising.</p>
              </div>
              <div>
                <h3 className="font-semibold">Third-party services</h3>
                <p>We may use Supabase, payment processors, hosting providers, and operational service providers to manage authentication, storage, payments, communications, and booking operations.</p>
              </div>
              <div>
                <h3 className="font-semibold">Data deletion</h3>
                <p>Use the <Link to="/delete-account" className="text-accent hover:underline">Account/Data Deletion page</Link> to request removal of your account and associated personal information.</p>
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
