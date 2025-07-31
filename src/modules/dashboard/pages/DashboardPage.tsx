import React from 'react';
import { DashboardStats } from '../components/organisms/DashboardStats';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/atoms/Button';
import { Plus, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {profile?.type === 'creator' 
              ? 'Gerencie seus produtos e acompanhe o desempenho'
              : 'Encontre produtos para promover e acompanhe seus ganhos'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          {profile?.type === 'creator' && (
            <Button asChild>
              <Link to="/products/create">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Link>
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <Link to="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ações Rápidas</h2>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/products">
                Ver Todos os Produtos
              </Link>
            </Button>
            
            {profile?.type === 'creator' && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/materials">
                  Gerenciar Materiais
                </Link>
              </Button>
            )}
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/analytics">
                Relatórios Detalhados
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resumo Recente</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Últimas 24h:</span>
              <span className="font-medium">
                {profile?.type === 'creator' ? '47 clicks' : '3 links copiados'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Esta semana:</span>
              <span className="font-medium">
                {profile?.type === 'creator' ? '12 conversões' : 'R$ 89,40'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Este mês:</span>
              <span className="font-medium">
                {profile?.type === 'creator' ? 'R$ 2.847,20' : 'R$ 1.247,80'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};