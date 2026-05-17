
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

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUs";
import Statistics from "./pages/Statistics";
import Financial from "./pages/Financial";
import Training from "./pages/Training";
import News from "./pages/News";
import Network from "./pages/Network";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import NECCAnalytics from "./pages/NECCAnalytics";

// Create a new QueryClient instance
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
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/statistics" 
                  element={
                    <ProtectedRoute>
                      <Statistics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/financial" 
                  element={
                    <ProtectedRoute>
                      <Financial />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/training" 
                  element={
                    <ProtectedRoute>
                      <Training />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/news" 
                  element={
                    <ProtectedRoute>
                      <News />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/network" 
                  element={
                    <ProtectedRoute>
                      <Network />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace" 
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/contact" 
                  element={<ContactUs />}
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/necc-analytics" 
                  element={
                    <ProtectedRoute>
                      <NECCAnalytics />
                    </ProtectedRoute>
                  } 
                />
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
