import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock3, MessageCircle, Plus, Download } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { jsPDF } from "jspdf";
import { useAuth } from "@/contexts/AuthContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const { user, profile } = useAuth();

  const order = (location.state as {
    orderId: string;
    shootType: string;
    date: string;
    time: string;
    location: string;
    people: number;
    notes?: string;
    amountPaid?: number;
    coupon?: string;
    paymentId?: string;
    transactionId?: string;
    paymentMessage?: string;
  }) || null;

  const formattedDate = order?.date
    ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.date))
    : "";

  const userName = profile?.display_name || user?.email?.split("@")[0] || "SnapStyles Client";
  const userEmail = user?.email || "Not provided";
  const userBio = profile?.bio || "Premium creator profile.";
  const appliedCoupon = order?.coupon ? order.coupon.toUpperCase() : "—";
  const paymentReference = order?.paymentId || "N/A";
  const transactionReference = order?.transactionId || order?.paymentId || "N/A";
  const paymentMessage = order?.paymentMessage || "SnapStyles shoot booking payment";
  const amountPaidText = order?.amountPaid === 0 ? "FREE" : order?.amountPaid ? `₹${order.amountPaid.toFixed(0)}` : "₹1000";

  const downloadConfirmationPdf = () => {
    if (!order) {
      navigate("/orders");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = 595;
    const margin = 40;

    doc.setFillColor(18, 18, 24);
    doc.rect(0, 0, pageWidth, 842, "F");

    doc.setFillColor(239, 68, 68);
    doc.rect(margin, margin, pageWidth - margin * 2, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("SnapStyles Shoot Confirmation", margin, 100);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 190);
    doc.text("A premium confirmation document for your scheduled shoot booking.", margin, 120);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Client details", margin, 160);

    doc.setFontSize(10);
    doc.setTextColor(190, 190, 200);
    doc.text(`Name: ${userName}`, margin, 180);
    doc.text(`Email: ${userEmail}`, margin, 195);
    doc.text(`Profile: ${userBio}`, margin, 210);

    const rightColumnX = pageWidth / 2 + 20;
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Booking summary", rightColumnX, 160);

    doc.setFontSize(10);
    doc.setTextColor(190, 190, 200);
    doc.text(`Order ID: ${order.orderId}`, rightColumnX, 180);
    doc.text(`Shoot Type: ${order.shootType}`, rightColumnX, 195);
    doc.text(`Status: Confirmed`, rightColumnX, 210);
    doc.text(`Date: ${formattedDate}`, rightColumnX, 225);
    doc.text(`Time: ${order.time} IST`, rightColumnX, 240);
    doc.text(`Amount Paid: ${amountPaidText}`, rightColumnX, 255);
    doc.text(`Coupon: ${appliedCoupon}`, rightColumnX, 270);
    doc.text(`Payment ID: ${paymentReference}`, rightColumnX, 285);
    doc.text(`Transaction ID: ${transactionReference}`, rightColumnX, 300);
    doc.text(`Payment Message: ${paymentMessage}`, rightColumnX, 315);

    doc.setDrawColor(80, 80, 100);
    doc.setLineWidth(0.5);
    doc.line(margin, 300, pageWidth - margin, 300);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Shoot details", margin, 330);

    doc.setFontSize(10);
    doc.setTextColor(190, 190, 200);
    doc.text(`Location: ${order.location}`, margin, 350);
    doc.text(`Participants: ${order.people}`, margin, 365);
    doc.text(`Time Zone: India Standard Time (Asia/Kolkata)`, margin, 380);

    const notesLines = doc.splitTextToSize(`Notes: ${order.notes || "No additional notes."}`, pageWidth - margin * 2);
    doc.text(notesLines, margin, 405);

    doc.setFontSize(10);
    doc.setTextColor(140, 140, 160);
    doc.text("Thank you for booking with SnapStyles. Please keep this document for your records.", margin, 500);

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
                  <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Amount Paid</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order?.amountPaid === 0 ? "FREE" : order?.amountPaid ? `₹${order.amountPaid.toFixed(0)}` : "₹1000"}</p>
                  </div>
                  <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Coupon</p>
                    <p className="mt-3 text-lg font-semibold text-white">{order?.coupon ? order.coupon.toUpperCase() : "—"}</p>
                  </div>
                  <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Payment ID</p>
                    <p className="mt-3 text-sm text-slate-300 break-all">{order?.paymentId || "N/A"}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Transaction ID</p>
                    <p className="mt-3 text-sm text-slate-300 break-all">{transactionReference}</p>
                  </div>
                  <div className="rounded-3xl border border-red-500/10 bg-slate-950 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Payment Message</p>
                    <p className="mt-3 text-sm text-slate-300">{paymentMessage}</p>
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
