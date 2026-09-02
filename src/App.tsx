import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import PullToRefresh from "@/components/PullToRefresh";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
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
import Bundle from "./pages/Bundle";
import ScrollToHash from "./components/ScrollToHash";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DiscountRedirect from "./pages/DiscountRedirect";
import ShopifyRedirectRoute from "./pages/ShopifyRedirectRoute";
import NewsletterConfirmed from "./pages/NewsletterConfirmed";
import Unsubscribe from "./pages/Unsubscribe";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PullToRefresh>
            <BrowserRouter>
                <ScrollToHash />
                <AnalyticsTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/discount/:code" element={<DiscountRedirect />} />

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
                <Route path="/newsletter-bestaetigt" element={<NewsletterConfirmed />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="*" element={<ShopifyRedirectRoute />} />
              </Routes>
            </BrowserRouter>
          </PullToRefresh>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
