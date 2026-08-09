import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { ChevronDown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const shootTypes = [
  "Portrait",
  "Wedding",
  "Event",
  "Product",
  "Fashion",
  "Pre-wedding",
  "Other",
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
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return Boolean(shootType && location && people > 0);
    }
    if (step === 2) {
      return Boolean(date && time);
    }
    return true;
  }, [step, shootType, location, people, date, time]);

  const handleNext = () => {
    if (!isStepValid) {
      toast({ title: "Please complete all required fields." });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConfirm = async () => {
    if (!date || !time || !shootType || !location || people <= 0) {
      toast({ title: "Please fill all required booking details." });
      return;
    }

    const now = new Date();
    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      toast({ title: "Select a future date in IST." });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    const orderId = `SS-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-001`;
    navigate(`/orders/${orderId}`, {
      state: {
        orderId,
        shootType,
        date: date.toISOString(),
        time,
        location,
        people,
        notes,
        status: "Confirmed",
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                <Sparkles className="w-4 h-4" /> Book a Shoot
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">Schedule your shoot in IST.</h1>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Choose your preferred shoot type, location, and time in India Standard Time (Asia/Kolkata).
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1.3fr,0.9fr]">
            <div className="space-y-6">
              <Card className="rounded-3xl border border-border bg-muted/70 shadow-xl shadow-black/5">
                <CardHeader>
                  <CardTitle>Step {step} of 3</CardTitle>
                  <CardDescription>Select the details for your shoot booking.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="shoot-type">Shoot Type</Label>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {shootTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setShootType(type)}
                              className={`rounded-3xl border px-4 py-3 text-left transition ${shootType === type ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent"}`}
                            >
                              <p className="font-medium">{type}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="Bangalore, India"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>
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
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Choose a date</Label>
                            <p className="text-sm text-muted-foreground">Only future IST dates are allowed.</p>
                          </div>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Asia/Kolkata</span>
                        </div>
                        <div className="rounded-3xl border border-border bg-background p-5">
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
                        <p className="text-sm text-muted-foreground">Your time is saved and shown in India Standard Time (IST).</p>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="rounded-3xl border border-border bg-background p-6">
                        <h3 className="text-xl font-semibold mb-4">Shoot Summary</h3>
                        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                          <div>
                            <p className="font-semibold">Shoot Type</p>
                            <p>{shootType || "—"}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Date</p>
                            <p>{formatDate(date)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Time</p>
                            <p>{formatTime(time)} IST</p>
                          </div>
                          <div>
                            <p className="font-semibold">Location</p>
                            <p>{location || "—"}</p>
                          </div>
                          <div>
                            <p className="font-semibold">People</p>
                            <p>{people}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Additional Notes</p>
                            <p>{notes || "No extra notes provided."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Shoot"}
                  </Button>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="rounded-3xl border border-border bg-background p-6 shadow-xl shadow-black/5">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Everything is shown in IST.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Selected Type</p>
                    <p>{shootType || "Choose a shoot type"}</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Schedule</p>
                    <p>{formatDate(date)} • {formatTime(time)} IST</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Location</p>
                    <p>{location || "Add a location"}</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Participants</p>
                    <p>{people}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-muted/70 p-4">
                    <p className="text-sm text-muted-foreground">All times are managed in India Standard Time (IST) · Asia/Kolkata.</p>
                  </div>
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
