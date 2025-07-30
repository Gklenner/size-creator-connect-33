import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/loading-spinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuthStatus, isLoading } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return <PageLoader text="Verificando autenticação..." />;
  }

  return <>{children}</>;
}