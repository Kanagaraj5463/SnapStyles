import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CalendarDays, Clock3, MapPin, Users, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const sampleOrders = [
  {
    id: "SS-20260815-001",
    shootType: "Portrait",
    date: "2026-08-15",
    time: "18:30",
    location: "Bangalore",
    people: 2,
    status: "Upcoming",
  },
  {
    id: "SS-20260710-004",
    shootType: "Product",
    date: "2026-07-10",
    time: "14:00",
    location: "Mumbai",
    people: 1,
    status: "Completed",
  },
];

const statusStyles: Record<string, string> = {
  Upcoming: "bg-accent/10 text-accent",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-100 text-slate-700",
  Cancelled: "bg-destructive/10 text-destructive",
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders] = useState(sampleOrders);

  const upcomingOrders = useMemo(
    () => orders.filter((order) => order.status === "Upcoming" || order.status === "Confirmed"),
    [orders],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl mx-auto mb-10 overflow-hidden rounded-[2rem] border border-border bg-card/95 p-10 shadow-xl shadow-black/5"
          >
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-accent shadow-sm">
                <Sparkles className="h-4 w-4" /> Orders
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
                  Your shoot bookings, made crisp and clear.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  Manage upcoming shoots with India Standard Time scheduling, clear booking summaries, and fast access to support from one polished dashboard.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-background p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Time zone</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">Asia/Kolkata</p>
                  <p className="mt-1 text-sm text-muted-foreground">India Standard Time (IST)</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Next action</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">Book your next shoot</p>
                  <p className="mt-1 text-sm text-muted-foreground">Keep your schedule crisp and your plans on time.</p>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
            </div>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/orders/new" className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Book a Shoot
              </Link>
            </Button>
          </div>

          {orders.length === 0 ? (
            <ScrollReveal>
              <motion.div className="rounded-3xl border border-border bg-muted/70 p-12 text-center shadow-xl shadow-black/5" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <h2 className="text-3xl font-semibold">No shoots scheduled yet</h2>
                <p className="mt-3 text-muted-foreground">Book your first shoot and bring your vision to life.</p>
                <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/orders/new">Book a Shoot</Link>
                </Button>
              </motion.div>
            </ScrollReveal>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <ScrollReveal key={order.id}>
                  <motion.article className="rounded-3xl border border-border bg-background p-6 shadow-xl shadow-black/5 transition hover:-translate-y-1"
                    whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Order ID {order.id}</p>
                        <h2 className="mt-3 text-2xl font-semibold">{order.shootType} Shoot</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{formatDate(order.date)} • {order.time} IST</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-3xl bg-muted/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                        <p className="mt-2 font-medium">{order.location}</p>
                      </div>
                      <div className="rounded-3xl bg-muted/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">People</p>
                        <p className="mt-2 font-medium">{order.people}</p>
                      </div>
                      <div className="rounded-3xl bg-muted/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</p>
                        <p className="mt-2 font-medium">{formatDate(order.date)}</p>
                      </div>
                      <div className="rounded-3xl bg-muted/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Time</p>
                        <p className="mt-2 font-medium">{order.time} IST</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2"> <MapPin className="w-4 h-4" /> {order.location}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2"> <Users className="w-4 h-4" /> {order.people} people</span>
                      </div>
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-2"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <CalendarDays className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </motion.article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
