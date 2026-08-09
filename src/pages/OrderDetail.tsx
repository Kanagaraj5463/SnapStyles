import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock3, MapPin, Users, ShieldCheck, ArrowRight, XCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useToast } from "@/hooks/use-toast";

const sampleOrder = {
  id: "SS-20260815-001",
  shootType: "Portrait",
  date: "2026-08-15",
  time: "18:30",
  location: "Bangalore",
  people: 2,
  notes: "Outdoor sunset shoot",
  status: "Upcoming",
};

const statusStyles: Record<string, string> = {
  Upcoming: "bg-accent/10 text-accent",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-100 text-slate-700",
  Cancelled: "bg-destructive/10 text-destructive",
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const locationState = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(sampleOrder);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (locationState.state && typeof locationState.state === "object") {
      setOrder({ ...(locationState.state as any), id: orderId || sampleOrder.id });
    }
  }, [locationState.state, orderId]);

  const isUpcoming = useMemo(() => order.status === "Upcoming" || order.status === "Confirmed", [order.status]);

  const handleCancel = async () => {
    setIsCancelling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOrder((prev) => ({ ...prev, status: "Cancelled" }));
    setIsCancelling(false);
    toast({ title: "Booking cancelled", description: "Your shoot has been cancelled." });
  };

  const handleReschedule = () => {
    setIsRescheduling(true);
    toast({ title: "Reschedule flow", description: "Reschedule is not fully connected yet." });
    setTimeout(() => setIsRescheduling(false), 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                <ShieldCheck className="w-4 h-4" /> Order Details
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">Booking details for {order.shootType} shoot</h1>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Review your scheduled shoot, update your plan, or contact support for any changes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="rounded-3xl border border-border bg-muted/70 shadow-xl shadow-black/5">
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Shoot</p>
                    <p className="mt-3 text-lg font-semibold">{order.shootType}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Status</p>
                    <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Schedule</p>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.date))}</p>
                      <p className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4" /> {order.time} IST</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Asia/Kolkata</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-background p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Location</p>
                    <p className="mt-3 text-lg font-semibold">{order.location}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{order.people} people</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-background p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Notes</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{order.notes || "No additional notes."}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-3xl border border-border bg-muted/70 p-6 shadow-xl shadow-black/5">
                <CardHeader>
                  <CardTitle>Need help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Contact support to update schedule requests or ask questions about your booking.</p>
                  <p>Reschedule or cancel only if your shoot is still upcoming.</p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/support")}
                >
                  Contact Support
                </Button>
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={!isUpcoming || isRescheduling}
                  onClick={handleReschedule}
                >
                  {isRescheduling ? "Opening reschedule..." : "Reschedule"}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={!isUpcoming || isCancelling}
                  onClick={handleCancel}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Booking"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
