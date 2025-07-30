import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/components/Auth/AuthProvider";
import { NotificationToaster } from "@/components/Layout/NotificationToaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Suspense } from "react";
import { PageLoader } from "@/components/ui/loading-spinner";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/Products/CreateProduct";
import Analytics from "./pages/Analytics/Analytics";
import Materials from "./pages/Materials/Materials";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NotificationToaster />
          <BrowserRouter>
            <Suspense fallback={<PageLoader text="Carregando página..." />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/products/create" element={
                  <ProtectedRoute>
                    <CreateProduct />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/materials" element={
                  <ProtectedRoute>
                    <Materials />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;