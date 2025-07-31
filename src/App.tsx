import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/shared/components/providers/AuthProvider';
import { NotificationProvider } from '@/shared/components/providers/NotificationProvider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Loader } from '@/shared/components/atoms/Loader';
import { useAuth } from '@/modules/auth/hooks/useAuth';

// Pages
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { ProductsPage } from '@/modules/products/pages/ProductsPage';

// Lazy load pages
const Analytics = React.lazy(() => import('@/pages/Analytics/Analytics'));
const Materials = React.lazy(() => import('@/pages/Materials/Materials'));
const CreateProduct = React.lazy(() => import('@/pages/Products/CreateProduct'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader size="xl" />
      <p className="mt-4 text-muted-foreground">Carregando página...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/auth" element={<LoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/products" 
                      element={
                        <ProtectedRoute>
                          <ProductsPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/products/create" 
                      element={
                        <ProtectedRoute>
                          <CreateProduct />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/materials" 
                      element={
                        <ProtectedRoute>
                          <Materials />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
          </NotificationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;