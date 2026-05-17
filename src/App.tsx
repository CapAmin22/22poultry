
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { I18nProvider } from "@/i18n/i18n";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// MVP Pages Only
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import LandingPage from "./pages/LandingPage";
import Marketplace from "./pages/Marketplace";
import NECCAnalytics from "./pages/NECCAnalytics";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <I18nProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <SearchProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />

                {/* Protected — MVP Core */}
                <Route path="/onboarding" element={
                  <ProtectedRoute><Onboarding /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Index /></ProtectedRoute>
                } />
                <Route path="/marketplace" element={
                  <ProtectedRoute><Marketplace /></ProtectedRoute>
                } />
                <Route path="/necc-analytics" element={
                  <ProtectedRoute><NECCAnalytics /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </SearchProvider>
        </SidebarProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
  </I18nProvider>
);

export default App;
