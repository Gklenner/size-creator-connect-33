import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '@/shared/components/molecules/LoginForm';
import { RegisterForm } from '@/shared/components/molecules/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/shared/components/atoms/Button';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Entre na sua conta para continuar' 
                : 'Crie sua conta para começar'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            {isLogin ? (
              <LoginForm 
                onSubmit={login}
                isLoading={isLoading}
              />
            ) : (
              <RegisterForm 
                onSubmit={register}
                isLoading={isLoading}
              />
            )}
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
                data-testid="toggle-auth-mode"
              >
                {isLogin 
                  ? 'Não tem uma conta? Cadastre-se' 
                  : 'Já tem uma conta? Faça login'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};