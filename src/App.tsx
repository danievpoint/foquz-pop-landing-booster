import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import PullToRefresh from "@/components/PullToRefresh";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";

import UeberUns from "./pages/UeberUns";
import DasIstDrin from "./pages/DasIstDrin";
import AGB from "./pages/AGB";
import Widerrufsbelehrung from "./pages/Widerrufsbelehrung";
import Versandbedingungen from "./pages/Versandbedingungen";
import B2BAnfragen from "./pages/B2BAnfragen";
import Anleitung from "./pages/Anleitung";
import HelpCenter from "./pages/HelpCenter";
import Faq from "./pages/Faq";
import ProductDetail from "./pages/ProductDetail";
import ScrollToHash from "./components/ScrollToHash";
import ComingSoonPage from "@/pages/ComingSoonPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

// Fester Launch-Zeitpunkt: 12. Juli 2026, 09:00 UTC (04:25 CEST-Angabe des Nutzers)
const LAUNCH_TS = Date.UTC(2026, 6, 12, 9, 0, 0);

const App = () => {
  const [launched, setLaunched] = useState(() => Date.now() >= LAUNCH_TS);

  useEffect(() => {
    if (launched) return;
    const remaining = LAUNCH_TS - Date.now();
    if (remaining <= 0) {
      setLaunched(true);
      return;
    }
    const t = window.setTimeout(() => setLaunched(true), remaining);
    return () => window.clearTimeout(t);
  }, [launched]);

  // Vor Launch: Vorschau via ?key=fq2026x. Nach Launch: Key irrelevant.
  const params = new URLSearchParams(window.location.search);
  const comingSoon = !launched && params.get("key") !== "fq2026x";

  if (comingSoon) {
    return (
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/agb" element={<AGB />} />
                <Route path="/widerrufsbelehrung" element={<Widerrufsbelehrung />} />
                <Route path="/versandbedingungen" element={<Versandbedingungen />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<ComingSoonPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    );
  }

  return (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PullToRefresh>
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            
            <Route path="/ueber-uns" element={<UeberUns />} />
            <Route path="/das-ist-drin" element={<DasIstDrin />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/widerrufsbelehrung" element={<Widerrufsbelehrung />} />
            <Route path="/versandbedingungen" element={<Versandbedingungen />} />
            <Route path="/b2b-anfragen" element={<B2BAnfragen />} />
            <Route path="/anleitung" element={<Anleitung />} />
            <Route path="/hilfe" element={<HelpCenter />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/produkt/:handle" element={<ProductDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </PullToRefresh>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
  );
};

export default App;
