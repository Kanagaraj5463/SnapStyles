import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Info, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const shootTypes = [
  {
    id: "Portrait",
    title: "Portrait",
    description: "Individual portraits with stylised lighting, mood, and expression.",
  },
  {
    id: "Wedding",
    title: "Wedding",
    description: "Cinematic wedding coverage for ceremonies, portraits, and celebrations.",
  },
  {
    id: "Event",
    title: "Event",
    description: "Live event photography for parties, launches, and corporate gatherings.",
  },
  {
    id: "Product",
    title: "Product",
    description: "Clean product imagery for catalogs, ads, and online stores.",
  },
  {
    id: "Fashion",
    title: "Fashion",
    description: "Editorial fashion shoots with styling and creative direction.",
  },
  {
    id: "Pre-wedding",
    title: "Pre-wedding",
    description: "Romantic pre-wedding sessions with cinematic storytelling.",
  },
  {
    id: "Car",
    title: "Car",
    description: "Automotive photography for cars, bikes, and lifestyle mobility shoots.",
  },
  {
    id: "Delivery",
    title: "Delivery",
    description: "On-location delivery and logistics imagery for commerce and brands.",
  },
  {
    id: "Model",
    title: "Model",
    description: "Portfolio and agency model shoots with a professional look.",
  },
  {
    id: "Casual",
    title: "Casual",
    description: "Relaxed lifestyle shoots for social media, branding, and content.",
  },
  {
    id: "Other",
    title: "Other",
    description: "Custom shoot style — describe your vision in the notes.",
  },
];

const formatDate = (date: Date | null) => {
  if (!date) return "Select a date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatTime = (time: string) => {
  if (!time) return "Select a time";
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const OrderNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [shootType, setShootType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const baseAmount = 100000; // ₹1000 in paise
  const amount = couponApplied ? 0 : baseAmount;
  const displayAmount = amount === 0 ? "FREE" : `₹${(amount / 100).toFixed(0)}`;

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return Boolean(shootType && customerName && contactNumber && instagramHandle && location && people > 0);
    }
    if (step === 2) {
      return Boolean(date && time);
    }
    return true;
  }, [step, shootType, location, people, date, time]);

  const selectedType = shootTypes.find((type) => type.id === shootType);

  const handleNext = () => {
    if (!isStepValid) {
      toast({ title: "Please complete all required fields." });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toLowerCase();
    if (code === "creators") {
      setCouponApplied(true);
      toast({ title: "Coupon applied", description: "Creators coupon gives you a free shoot." });
      return;
    }

    setCouponApplied(false);
    toast({ title: "Invalid coupon", description: "Use coupon code creators for a free shoot." });
  };

  const createOrderId = () => {
    const dateKey = `${date?.getFullYear()}${String(date?.getMonth() + 1).padStart(2, "0")}${String(date?.getDate()).padStart(2, "0")}`;
    const randomSuffix = String(Math.floor(Math.random() * 900) + 100);
    return `SS-${dateKey}-${randomSuffix}`;
  };

  const handlePaymentSuccess = (orderId: string, paymentId?: string) => {
    setIsPaymentProcessing(false);
    navigate(`/orders/${orderId}/confirmation`, {
      state: {
        orderId,
        shootType,
        date: date?.toISOString(),
        time,
        location,
        people,
        notes,
        status: "Confirmed",
        amountPaid: amount === 0 ? 0 : amount / 100,
        coupon: couponApplied ? "creators" : undefined,
        paymentId,
      },
    });
  };

  const handlePayment = async () => {
    if (!date || !time || !shootType || !customerName || !contactNumber || !instagramHandle || !location || people <= 0) {
      toast({ title: "Please fill all required booking details." });
      return;
    }

    const now = new Date();
    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      toast({ title: "Select a future date in IST." });
      return;
    }

    const orderId = createOrderId();
    const selectedAmount = amount;

    if (selectedAmount === 0) {
      toast({ title: "Free shoot confirmed", description: "Your shoot is booked with the creators coupon." });
      handlePaymentSuccess(orderId);
      return;
    }

    setIsPaymentProcessing(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setIsPaymentProcessing(false);
      toast({ title: "Payment failed", description: "Unable to load Razorpay checkout. Please try again." });
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID",
      amount: selectedAmount,
      currency: "INR",
      name: "SnapStyles",
      description: `${shootType} shoot booking`,
      prefill: {
        name: "SnapStyles Client",
        email: "client@example.com",
      },
      notes: {
        shootType,
        location,
        people: String(people),
        date: date.toISOString(),
      },
      theme: { color: "#ef4444" },
      handler: (response: any) => {
        handlePaymentSuccess(orderId, response?.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => {
          setIsPaymentProcessing(false);
          toast({ title: "Payment cancelled", description: "Razorpay checkout was closed before completion." });
        },
      },
    };

    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      setIsPaymentProcessing(false);
      toast({ title: "Payment failed", description: "Razorpay is not available." });
      return;
    }

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center mb-10 rounded-[2rem] border border-red-500/10 bg-slate-900/80 p-8 shadow-[0_30px_80px_-40px_rgba(248,113,113,0.55)]"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-300">
                <Sparkles className="w-4 h-4 text-red-400" /> Book a Shoot
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold text-white">Schedule your shoot in IST.</h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Choose your preferred shoot type, location, and time in India Standard Time (Asia/Kolkata).
              </p>
            </motion.div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1.3fr,0.9fr]">
            <div className="space-y-6">
              <Card className="rounded-3xl border border-red-500/20 bg-slate-950/90 shadow-[0_40px_120px_-60px_rgba(248,113,113,0.65)]">
                <CardHeader>
                  <CardTitle>Step {step} of 3</CardTitle>
                  <CardDescription>Select the details for your shoot booking.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-6"
                      >
                        <div className="space-y-3">
                          <Label htmlFor="shoot-type">Shoot Type</Label>
                          <p className="text-sm text-slate-400">Enter your name, contact number, Instagram handle, venue address, and the shoot date to continue.</p>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {shootTypes.map((type) => {
                              const selected = shootType === type.id;
                              return (
                                <motion.button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setShootType(type.id)}
                                  whileHover={{ y: -4, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`rounded-3xl border px-4 py-4 text-left transition ${selected ? "border-red-500 bg-red-600/15 text-white shadow-[0_15px_40px_-24px_rgba(248,113,113,0.85)]" : "border-slate-800 bg-slate-950/75 text-slate-100 hover:border-red-500"}`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-medium">{type.title}</p>
                                      <p className={`mt-1 text-sm ${selected ? "text-red-200" : "text-slate-400"}`}>
                                        {type.description}
                                      </p>
                                    </div>
                                    <HoverCard>
                                      <HoverCardTrigger asChild>
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${selected ? "bg-red-500 text-slate-950" : "bg-slate-800 text-slate-300"} hover:bg-red-500 hover:text-slate-950`}>
                                          <Info className="h-4 w-4" />
                                        </span>
                                      </HoverCardTrigger>
                                      <HoverCardContent className="text-sm leading-6 text-foreground">
                                        {type.description}
                                      </HoverCardContent>
                                    </HoverCard>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="customer-name">Your Name</Label>
                            <Input
                              id="customer-name"
                              placeholder="Enter your full name"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-number">Contact Number</Label>
                            <Input
                              id="contact-number"
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={contactNumber}
                              onChange={(e) => setContactNumber(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="instagram-handle">Instagram Handle</Label>
                            <Input
                              id="instagram-handle"
                              placeholder="@yourhandle"
                              value={instagramHandle}
                              onChange={(e) => setInstagramHandle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Google Maps Location</Label>
                            <Input
                              id="location"
                              placeholder="Google Maps venue address"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="people">Number of People</Label>
                            <Input
                              id="people"
                              type="number"
                              min={1}
                              value={people}
                              onChange={(e) => setPeople(Number(e.target.value))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Requirements / Notes</Label>
                          <Textarea
                            id="notes"
                            placeholder="Outdoor sunset shoot, props, wardrobe notes..."
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Choose a date</Label>
                              <p className="text-sm text-slate-400">Only future IST dates are allowed.</p>
                            </div>
                            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">Asia/Kolkata</span>
                          </div>
                          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                            <Calendar
                              mode="single"
                              selected={date ?? undefined}
                              onSelect={(selected) => setDate(selected)}
                              disabled={[{ before: new Date() }]}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="time">Shoot Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                          <p className="text-sm text-slate-400">Your time is saved and shown in India Standard Time (IST).</p>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-6"
                      >
                        <div className="rounded-3xl border border-red-500/20 bg-slate-950 p-6">
                          <h3 className="text-xl font-semibold mb-4 text-white">Shoot Summary</h3>
                          <div className="space-y-3 text-sm leading-7 text-slate-300">
                            <div>
                              <p className="font-semibold text-white">Shoot Type</p>
                              <p>{shootType || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Date</p>
                              <p>{formatDate(date)}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Time</p>
                              <p>{formatTime(time)} IST</p>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Location</p>
                              <p>{location || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-white">People</p>
                              <p>{people}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Additional Notes</p>
                              <p>{notes || "No extra notes provided."}</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-3xl border border-red-500/20 bg-slate-950 p-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Payment</p>
                            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase text-slate-400">{displayAmount}</span>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,auto]">
                            <Input
                              id="coupon"
                              placeholder="Coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <Button
                              type="button"
                              className="bg-red-500 text-slate-950 hover:bg-red-400"
                              onClick={applyCoupon}
                            >
                              Apply
                            </Button>
                          </div>
                          <p className="mt-3 text-sm text-slate-400">
                            Use code <span className="font-semibold text-white">creators</span> for a free shoot.
                          </p>
                          {couponApplied && (
                            <p className="mt-3 text-sm text-emerald-300">Coupon applied — your shoot is free.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleBack} disabled={step === 1}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handlePayment}
                    disabled={isPaymentProcessing}
                  >
                    {isPaymentProcessing ? "Processing..." : couponApplied ? "Complete Free Shoot" : "Pay ₹1000"}
                  </Button>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="rounded-3xl border border-red-500/20 bg-slate-950/95 p-6 shadow-[0_35px_100px_-60px_rgba(248,113,113,0.65)]">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Everything is shown in IST.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="font-semibold text-white">Selected Type</p>
                    <p>{selectedType?.title || "Choose a shoot type"}</p>
                  </div>
                  {selectedType && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4"
                    >
                      <p className="text-sm text-red-200">{selectedType.description}</p>
                    </motion.div>
                  )}
                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="font-semibold text-white">Schedule</p>
                    <p>{formatDate(date)} • {formatTime(time)} IST</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="font-semibold text-white">Location</p>
                    <p>{location || "Add a location"}</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="font-semibold text-white">Participants</p>
                    <p>{people}</p>
                  </div>
                  <motion.div
                    animate={{ boxShadow: selectedType ? "0 0 60px rgba(248,113,113,0.2)" : "0 0 0 rgba(0,0,0,0)" }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-red-500/10 bg-slate-900/90 p-4"
                  >
                    <p className="text-sm text-slate-300">All times are managed in India Standard Time (IST) · Asia/Kolkata.</p>
                  </motion.div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border bg-muted/70 p-6 shadow-xl shadow-black/5">
                <CardHeader>
                  <CardTitle>Need help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Once your shoot is confirmed, you can view the order details and reschedule or cancel if needed.</p>
                  <p>Contact support anytime if you need help with timing, locations or shoot preparation.</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderNew;
