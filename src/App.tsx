import { lazy, Suspense } from "react";
const ZehnerBundle = lazy(() => import("./pages/ZehnerBundle"));
const SquadBundle = lazy(() => import("./pages/SquadBundle"));
const StarterBundle = lazy(() => import("./pages/StarterBundle"));
const PeachParty = lazy(() => import("./pages/PeachParty"));
const ThaiStyle = lazy(() => import("./pages/ThaiStyle"));
const LemonBreezy = lazy(() => import("./pages/LemonBreezy"));
const WatermelonFlex = lazy(() => import("./pages/WatermelonFlex"));
const BlueberryFlow = lazy(() => import("./pages/BlueberryFlow"));
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import PullToRefresh from "@/components/PullToRefresh";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const Impressum = lazy(() => import("./pages/Impressum"));

const UeberUns = lazy(() => import("./pages/UeberUns"));
const DasIstDrin = lazy(() => import("./pages/DasIstDrin"));
const AGB = lazy(() => import("./pages/AGB"));
const Widerrufsbelehrung = lazy(() => import("./pages/Widerrufsbelehrung"));
const Versandbedingungen = lazy(() => import("./pages/Versandbedingungen"));
const B2BAnfragen = lazy(() => import("./pages/B2BAnfragen"));
const Anleitung = lazy(() => import("./pages/Anleitung"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Faq = lazy(() => import("./pages/Faq"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

import ScrollToHash from "./components/ScrollToHash";
import GlobalMarquee from "./components/GlobalMarquee";
import AnalyticsTracker from "./components/AnalyticsTracker";
import KlaviyoNewsletterBridge from "./components/KlaviyoNewsletterBridge";
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DiscountRedirect = lazy(() => import("./pages/DiscountRedirect"));
const ShopifyRedirectRoute = lazy(() => import("./pages/ShopifyRedirectRoute"));
const NewsletterConfirmed = lazy(() => import("./pages/NewsletterConfirmed"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));



const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <KlaviyoNewsletterBridge />
          
          <PullToRefresh>
            <BrowserRouter>
                <ScrollToHash />
                <AnalyticsTracker />
                <GlobalMarquee />
              <Suspense fallback={null}>
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
                <Route path="/produkt/peach-party" element={<PeachParty />} />
                <Route path="/produkte/peach-party" element={<PeachParty />} />
                <Route path="/produkt/thai-style" element={<ThaiStyle />} />
                <Route path="/produkte/thai-style" element={<ThaiStyle />} />
                <Route path="/produkt/lemon-breezy" element={<LemonBreezy />} />
                <Route path="/produkte/lemon-breezy" element={<LemonBreezy />} />
                <Route path="/produkt/watermelon-flex" element={<WatermelonFlex />} />
                <Route path="/produkte/watermelon-flex" element={<WatermelonFlex />} />
                <Route path="/produkt/blueberry-flow" element={<BlueberryFlow />} />
                <Route path="/produkte/blueberry-flow" element={<BlueberryFlow />} />
                <Route path="/produkt/zehner-bundle" element={<ZehnerBundle />} />
                <Route path="/produkt/vorrats-bundle" element={<ZehnerBundle />} />
                <Route path="/produkt/10er-crew-bundle" element={<ZehnerBundle />} />
                <Route path="/produkt/10er-vorrats-bundle" element={<ZehnerBundle />} />
                <Route path="/produkte/zehner-bundle" element={<ZehnerBundle />} />
                <Route path="/produkte/vorrats-bundle" element={<ZehnerBundle />} />
                <Route path="/produkte/10er-crew-bundle" element={<ZehnerBundle />} />
                <Route path="/produkte/10er-vorrats-bundle" element={<ZehnerBundle />} />
                <Route path="/produkt/squad-bundle" element={<SquadBundle />} />
                <Route path="/produkte/squad-bundle" element={<SquadBundle />} />
                <Route path="/produkt/5er-squad-bundle" element={<SquadBundle />} />
                <Route path="/produkte/5er-squad-bundle" element={<SquadBundle />} />
                <Route path="/produkt/starter-bundle" element={<StarterBundle />} />
                <Route path="/produkte/starter-bundle" element={<StarterBundle />} />
                <Route path="/produkt/:handle" element={<ProductDetail />} />
                
                <Route path="/newsletter-bestaetigt" element={<NewsletterConfirmed />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="*" element={<ShopifyRedirectRoute />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </PullToRefresh>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
