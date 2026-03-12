import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ZakatGPT } from "@/components/ZakatGPT";
import NotFound from "@/pages/not-found";

function RedirectToHome() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/");
  }, [setLocation]);
  return null;
}

// Page Imports
import Home from "@/pages/Home";
import CalculatorPage from "@/pages/CalculatorPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import About from "@/pages/About";
import TermsAndConditions from "@/pages/TermsAndConditions";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calculator" component={CalculatorPage} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/understanding-zakat" component={RedirectToHome} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ZakatGPT />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
