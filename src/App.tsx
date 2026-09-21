import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimationProvider } from "@/contexts/AnimationContext";
import { PageFade } from "@/components/layout/PageFade";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import SnapStream from "./pages/SnapStream";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import CreatorLevels from "./pages/CreatorLevels";
import LiveCollab from "./pages/LiveCollab";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Support from "./pages/Support";
import DeleteAccount from "./pages/DeleteAccount";
import Orders from "./pages/Orders";
import OrderNew from "./pages/OrderNew";
import OrderDetail from "./pages/OrderDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import LiveStudio from "./pages/LiveStudio";
import LiveViewer from "./pages/LiveViewer";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AnimationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageFade>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/snap-stream" element={<SnapStream />} />
                <Route path="/live/:username/:streamId" element={<LiveViewer />} />
                <Route path="/services" element={<Services />} />
                <Route path="/live-collab" element={<LiveCollab />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/support" element={<Support />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/new" element={<OrderNew />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/orders/:orderId/confirmation" element={<OrderConfirmation />} />

                {/* ✅ NEW PAGE: Creator Levels */}
                <Route path="/creator-levels" element={<CreatorLevels />} />

                {/* Protected Pages */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/studio/live"
                  element={
                    <ProtectedRoute>
                      <LiveStudio />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageFade>
          </BrowserRouter>
        </AnimationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
