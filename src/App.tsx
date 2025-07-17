import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { I18nContext, useI18nProvider } from "@/hooks/useI18n";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Breadcrumb from "@/components/seo/Breadcrumb";
import Index from "./pages/Index";
import ToolPage from "./pages/ToolPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  console.log('App.tsx: AppContent rendering...');
  
  return (
    <FavoritesProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <Header />
            <div className="flex-1">
              <div className="container mx-auto px-4 py-4">
                <Breadcrumb />
              </div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tools/:toolId" element={<ToolPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </FavoritesProvider>
  );
};

const App = () => {
  console.log('App.tsx: App component rendering...');
  
  try {
    const i18nState = useI18nProvider();
    console.log('App.tsx: i18n state loaded:', !!i18nState);

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <I18nContext.Provider value={i18nState}>
            <TooltipProvider>
              <Sonner />
              <ShadcnToaster />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </I18nContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App.tsx: Error in App component:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Application Error</h1>
        <p>There was an error loading the application. Check the console for details.</p>
        <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    );
  }
};

export default App;
