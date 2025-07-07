import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { I18nContext, useI18nProvider } from "@/hooks/useI18n";
import { Header } from "@/components/layout/Header";
import Index from "./pages/Index";
import ToolPage from "./pages/ToolPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/tools/:toolId" element={<ToolPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

const App = () => {
  const i18nState = useI18nProvider();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nContext.Provider value={i18nState}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </I18nContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
