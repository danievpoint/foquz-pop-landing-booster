import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import PullToRefresh from "@/components/PullToRefresh";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import FAQ from "./pages/FAQ";
import UeberUns from "./pages/UeberUns";
import DasIstDrin from "./pages/DasIstDrin";
import AGB from "./pages/AGB";
import Widerrufsbelehrung from "./pages/Widerrufsbelehrung";
import Versandbedingungen from "./pages/Versandbedingungen";
import B2BAnfragen from "./pages/B2BAnfragen";
import Anleitung from "./pages/Anleitung";
import HelpCenter from "./pages/HelpCenter";
import ProductDetail from "./pages/ProductDetail";
import ScrollToHash from "./components/ScrollToHash";
import ComingSoonPage from "@/pages/ComingSoonPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

// Coming Soon Modus — mit ?key=fq2026x in der URL umgehen
const params = new URLSearchParams(window.location.search);
const COMING_SOON = params.get("key") !== "fq2026x";

const App = () => {
  if (COMING_SOON) {
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
            <Route path="/faq" element={<FAQ />} />
            <Route path="/ueber-uns" element={<UeberUns />} />
            <Route path="/das-ist-drin" element={<DasIstDrin />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/widerrufsbelehrung" element={<Widerrufsbelehrung />} />
            <Route path="/versandbedingungen" element={<Versandbedingungen />} />
            <Route path="/b2b-anfragen" element={<B2BAnfragen />} />
            <Route path="/anleitung" element={<Anleitung />} />
            <Route path="/hilfe" element={<HelpCenter />} />
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
