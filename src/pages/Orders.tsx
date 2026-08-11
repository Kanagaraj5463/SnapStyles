import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CalendarDays, Clock3, MapPin, Users, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";


const statusStyles: Record<string, string> = {
  Upcoming: "bg-red-500/10 text-red-300",
  Confirmed: "bg-red-600/15 text-red-200",
  Completed: "bg-slate-800 text-slate-300",
  Cancelled: "bg-red-700/15 text-red-200",
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
  const [orders] = useState([]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl mx-auto mb-10 overflow-hidden rounded-[2rem] border border-red-500/10 bg-slate-900/95 p-10 shadow-[0_40px_120px_-50px_rgba(248,113,113,0.4)]"
          >
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-red-200 shadow-sm shadow-red-500/20">
                <Sparkles className="h-4 w-4 text-red-400" /> Orders
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
                  Your shoot bookings, made crisp and clear.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  Manage upcoming shoots with India Standard Time scheduling, clear booking summaries, and fast access to support from one polished dashboard.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Time zone</p>
                  <p className="mt-3 text-xl font-semibold text-white">Asia/Kolkata</p>
                  <p className="mt-1 text-sm text-slate-400">India Standard Time (IST)</p>
                </div>
                <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Next action</p>
                  <p className="mt-3 text-xl font-semibold text-white">Book your next shoot</p>
                  <p className="mt-1 text-sm text-slate-400">Keep your schedule crisp and your plans on time.</p>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
            </div>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-4 rounded-3xl">
              <Link to="/orders/new" className="inline-flex items-center gap-3">
                <Plus className="w-5 h-5" /> Book Now
              </Link>
            </Button>
          </div>

          {orders.length === 0 ? (
            <ScrollReveal>
              <motion.div className="rounded-3xl border border-red-500/10 bg-slate-950/90 p-12 text-center shadow-[0_30px_90px_-50px_rgba(248,113,113,0.35)]" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <h2 className="text-3xl font-semibold text-white">No shoots scheduled yet</h2>
                <p className="mt-3 text-slate-400">Book your first shoot and bring your vision to life.</p>
                <Button asChild className="mt-6 bg-red-500 text-slate-950 hover:bg-red-400">
                  <Link to="/orders/new">Book a Shoot</Link>
                </Button>
              </motion.div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <motion.div className="rounded-3xl border border-red-500/10 bg-slate-950/90 p-12 text-center shadow-[0_30px_90px_-50px_rgba(248,113,113,0.35)]" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <h2 className="text-3xl font-semibold text-white">No shoots scheduled yet</h2>
                <p className="mt-3 text-slate-400">Book your next shoot now and start planning your perfect content session.</p>
                <Button asChild className="mt-6 bg-red-500 text-slate-950 hover:bg-red-400 text-lg px-8 py-4 rounded-3xl">
                  <Link to="/orders/new">Book Now</Link>
                </Button>
              </motion.div>
            </ScrollReveal>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
