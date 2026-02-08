import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import FreeKundli from "./pages/FreeKundli";
import KundliMatching from "./pages/KundliMatching";
import Calculators from "./pages/Calculators";
import Consultation from "./pages/Consultation";
import GemstoneStore from "./pages/GemstoneStore";
import GemstoneDetail from "./pages/GemstoneDetail";
import PalmReading from "./pages/PalmReading";
import Horoscope from "./pages/Horoscope";
import Admin from "./pages/Admin";
import AdminCustomers from "./pages/AdminCustomers";
import GemstoneCompare from "./pages/GemstoneCompare";
import PurchaseHistory from "./pages/PurchaseHistory";
import TrackOrder from "./pages/TrackOrder";
import MyWallet from "./pages/MyWallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/free-kundli" element={<FreeKundli />} />
              <Route path="/kundli-matching" element={<KundliMatching />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/gemstone-store" element={<GemstoneStore />} />
              <Route path="/gemstone/:id" element={<GemstoneDetail />} />
              <Route path="/palm-reading" element={<PalmReading />} />
              <Route path="/horoscope/:sign" element={<Horoscope />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/gemstone-compare" element={<GemstoneCompare />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/my-wallet" element={<MyWallet />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
