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
  Upcoming: "bg-red-500/10 text-red-200",
  Confirmed: "bg-red-600/15 text-red-100",
  Completed: "bg-slate-800 text-slate-300",
  Cancelled: "bg-red-700/15 text-red-200",
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-200 shadow-sm shadow-red-500/20">
                <ShieldCheck className="w-4 h-4 text-red-300" /> Order Details
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold text-white">Booking details for {order.shootType} shoot</h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Review your scheduled shoot, update your plan, or contact support for any changes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="rounded-3xl border border-red-500/10 bg-slate-900/90 shadow-[0_40px_120px_-60px_rgba(248,113,113,0.35)]">
              <CardHeader>
                <CardTitle className="text-white">Order #{order.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Shoot</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order.shootType}</p>
                    <p className="mt-2 text-sm text-slate-400">{order.notes}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</p>
                    <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Schedule</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      <p className="font-semibold text-white">{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.date))}</p>
                      <p className="inline-flex items-center gap-2 text-slate-300"><Clock3 className="w-4 h-4 text-red-400" /> {order.time} IST</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Asia/Kolkata</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Location</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order.location}</p>
                    <p className="mt-2 text-sm text-slate-300">{order.people} people</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-950 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Notes</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{order.notes || "No additional notes."}</p>
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
                  className="w-full border-red-500 text-red-200 hover:border-red-400 hover:text-white"
                  onClick={() => navigate("/support")}
                >
                  Contact Support
                </Button>
                <Button
                  className="w-full bg-red-500 text-slate-950 hover:bg-red-400"
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
