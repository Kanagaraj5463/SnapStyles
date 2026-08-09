import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CalendarDays, Clock3, MapPin, ArrowRight, MessageCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state as {
    orderId: string;
    shootType: string;
    date: string;
    time: string;
    location: string;
    people: number;
    notes?: string;
  } | null;

  const formattedDate = order?.date
    ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.date))
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                <CheckCircle2 className="w-4 h-4" /> Shoot Booked Successfully!
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">Your shoot has been scheduled.</h1>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Thank you for booking with SnapStyles. Your order has been confirmed and is ready for the studio.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <motion.section className="mx-auto max-w-4xl rounded-3xl border border-border bg-muted/70 p-8 shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-8">
                <div className="space-y-3 text-center">
                  <p className="uppercase tracking-[0.35em] text-xs text-muted-foreground">Order ID</p>
                  <h2 className="text-3xl font-semibold">{order?.orderId || orderId}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Shoot Details</p>
                    <p className="mt-3 text-lg font-semibold">{order?.shootType || "Shoot"}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{order?.notes || "Personalised shoot experience"}</p>
                  </div>
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Schedule</p>
                    <p className="mt-3 text-lg font-semibold">{formattedDate}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="w-4 h-4" /> {order?.time} IST
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Asia/Kolkata</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Location</p>
                    <p className="mt-3 text-lg font-semibold">{order?.location || "India"}</p>
                  </div>
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Participants</p>
                    <p className="mt-3 text-lg font-semibold">{order?.people ?? "—"}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate(`/orders/${order?.orderId || orderId}`)}>
                    View Order
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/orders")}>Back to Orders</Button>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <a href="mailto:snapstyles@gmail.com">
                <MessageCircle className="w-4 h-4 mr-2 inline" /> Contact Support
              </a>
            </Button>
            <Button asChild className="w-full bg-muted hover:bg-muted/90">
              <a href="https://calendar.google.com/calendar/r/eventedit?text=SnapStyles+Shoot+Booking" target="_blank" rel="noreferrer">
                <Plus className="w-4 h-4 mr-2 inline" /> Add to Calendar
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
