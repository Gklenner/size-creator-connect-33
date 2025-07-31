import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Eye } from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useProducts } from '@/modules/products/hooks/useProducts';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {trend && (
        <div className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
          <TrendingUp className={`h-3 w-3 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
          {trend.isPositive ? '+' : ''}{trend.value}% vs mês anterior
        </div>
      )}
    </CardContent>
  </Card>
);

export const DashboardStats: React.FC = () => {
  const { profile } = useAuth();
  const { getUserProducts, getAvailableProducts } = useProducts();

  const userProducts = getUserProducts();
  const availableProducts = getAvailableProducts();

  // Calculate stats based on user type
  const stats = React.useMemo(() => {
    if (profile?.type === 'creator') {
      const totalClicks = userProducts.reduce((sum, p) => sum + p.click_count, 0);
      const totalConversions = userProducts.reduce((sum, p) => sum + p.conversion_count, 0);
      const totalRevenue = userProducts.reduce((sum, p) => 
        sum + (p.conversion_count * p.price * (p.commission / 100)), 0
      );
      
      return [
        {
          title: "Produtos Ativos",
          value: userProducts.filter(p => p.is_active).length,
          description: `${userProducts.length} produtos no total`,
          icon: <Eye className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 12, isPositive: true }
        },
        {
          title: "Total de Clicks",
          value: totalClicks.toLocaleString(),
          description: "Clicks em todos os produtos",
          icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 8, isPositive: true }
        },
        {
          title: "Conversões",
          value: totalConversions.toLocaleString(),
          description: "Vendas realizadas",
          icon: <Users className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 15, isPositive: true }
        },
        {
          title: "Receita Estimada",
          value: `R$ ${totalRevenue.toFixed(2)}`,
          description: "Baseado nas comissões",
          icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 23, isPositive: true }
        }
      ];
    } else {
      // Affiliate stats
      return [
        {
          title: "Produtos Disponíveis",
          value: availableProducts.length,
          description: "Para promover",
          icon: <Eye className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: "Links Copiados",
          value: "47", // TODO: Track this metric
          description: "Este mês",
          icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 12, isPositive: true }
        },
        {
          title: "Conversões",
          value: "12", // TODO: Track from referrals
          description: "Vendas realizadas",
          icon: <Users className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 8, isPositive: true }
        },
        {
          title: "Comissões",
          value: "R$ 1.247,80", // TODO: Calculate from referrals
          description: "Total ganho",
          icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
          trend: { value: 15, isPositive: true }
        }
      ];
    }
  }, [profile?.type, userProducts, availableProducts]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="dashboard-stats">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};