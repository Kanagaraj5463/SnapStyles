import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock3, MessageCircle, Plus, Download } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { jsPDF } from "jspdf";

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

  const downloadConfirmationPdf = () => {
    if (!order) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(20);
    doc.text("SnapStyles Shoot Confirmation", 40, 60);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 40, 100);
    doc.text(`Shoot Type: ${order.shootType}`, 40, 120);
    doc.text(`Date: ${formattedDate}`, 40, 140);
    doc.text(`Time: ${order.time} IST`, 40, 160);
    doc.text(`Location: ${order.location}`, 40, 180);
    doc.text(`Participants: ${order.people}`, 40, 200);
    doc.text(`Notes: ${order.notes || "No additional notes."}`, 40, 220);
    doc.text("Time Zone: India Standard Time (Asia/Kolkata)", 40, 240);

    doc.setFontSize(10);
    doc.text("Thank you for booking with SnapStyles. Please keep this confirmation for your records.", 40, 280);

    doc.save(`${order.orderId}-confirmation.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-200 shadow-sm shadow-red-500/20">
                <CheckCircle2 className="w-4 h-4 text-red-300" /> Shoot Booked Successfully!
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold text-white">Your shoot has been scheduled.</h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Thank you for booking with SnapStyles. Your order has been confirmed and is ready for the studio.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <motion.section className="mx-auto max-w-4xl rounded-3xl border border-red-500/10 bg-slate-900/90 p-8 shadow-[0_40px_120px_-60px_rgba(248,113,113,0.35)]" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col gap-8">
                <div className="space-y-3 text-center">
                  <p className="uppercase tracking-[0.35em] text-xs text-slate-400">Order ID</p>
                  <h2 className="text-3xl font-semibold text-white">{order?.orderId || orderId}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Shoot Details</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order?.shootType || "Shoot"}</p>
                    <p className="mt-2 text-sm text-slate-300">{order?.notes || "Personalised shoot experience"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Schedule</p>
                    <p className="mt-3 text-lg font-semibold text-white">{formattedDate}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
                      <Clock3 className="w-4 h-4 text-red-400" /> {order?.time} IST
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Asia/Kolkata</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Location</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order?.location || "India"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Participants</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order?.people ?? "—"}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Button className="bg-red-500 text-slate-950 hover:bg-red-400" onClick={() => navigate(`/orders/${order?.orderId || orderId}`)}>
                    View Order
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-200 hover:border-red-400 hover:text-white" onClick={() => navigate("/orders")}>Back to Orders</Button>
                  <Button className="bg-slate-700 text-white hover:bg-slate-600" onClick={downloadConfirmationPdf}>
                    <Download className="w-4 h-4" /> Download PDF
                  </Button>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Button asChild className="w-full bg-slate-800 text-white hover:bg-slate-700">
              <a href="mailto:snapstyles@gmail.com">
                <MessageCircle className="w-4 h-4 mr-2 inline" /> Contact Support
              </a>
            </Button>
            <Button asChild className="w-full bg-red-500 text-slate-950 hover:bg-red-400">
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
