import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/loading-spinner';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthProvider({ children, requireAuth = false }: AuthProviderProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader text="Verificando autenticação..." />;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect unauthenticated users to login for protected routes
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Wrapper for protected routes
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider requireAuth={true}>
      {children}
    </AuthProvider>
  );
}