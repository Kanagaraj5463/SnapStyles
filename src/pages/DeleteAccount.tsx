import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/animations/ScrollReveal";

const DeleteAccount = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in before requesting account deletion." });
      setIsSubmitting(false);
      return;
    }

    try {
      // Implement actual deletion flow when backend support exists.
      // For now, we simulate the request and sign the user out.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await signOut();
      toast({ title: "Deletion requested", description: "Your account deletion request has been submitted." });
      navigate("/");
    } catch (error) {
      toast({ title: "Unable to submit request", description: "Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
                <Trash2 className="w-4 h-4" /> Account Deletion
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold">Request account and data deletion.</h1>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                We respect your privacy and provide a direct path to remove your personal information from SnapStyles.
              </p>
            </div>
          </ScrollReveal>

          <Card className="mx-auto max-w-3xl rounded-3xl border border-border bg-muted/70 shadow-xl shadow-black/5">
            <CardHeader>
              <CardTitle className="text-2xl">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>When you request account deletion, we will remove your profile, personal details, and booking-related data from our systems wherever possible.</p>
                <p>This includes account identification, booking metadata, and any related support records. Some records may remain where required for legal or security reasons.</p>
                <p>If you have any questions, contact us at <a href="mailto:snapstyles@gmail.com" className="text-accent hover:underline">snapstyles@gmail.com</a>.</p>
              </div>

              <div className="rounded-3xl border border-border bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-destructive/10 p-3 text-destructive">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">What to expect</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-7">
                      You may receive a confirmation email after the deletion request. This process may take up to a few business days depending on backend support.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Requesting deletion..." : "Request Account Deletion"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeleteAccount;
