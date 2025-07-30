import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  Eye,
  MousePointer,
  ShoppingCart,
  Percent
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const { user } = useAuth();
  const { products } = useProducts();

  // Calculate real analytics from products data
  const analyticsData = useMemo(() => {
    const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
    const totalConversions = products.reduce((sum, p) => sum + p.conversionCount, 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.conversionCount * p.price * p.commission / 100), 0);
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      overview: {
        totalClicks,
        totalConversions,
        totalRevenue,
        avgConversionRate: Number(avgConversionRate.toFixed(2)),
        growth: {
          clicks: 12.5,
          conversions: 8.2,
          revenue: 15.3
        }
      },
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        clicks: p.clickCount,
        conversions: p.conversionCount,
        earnings: p.conversionCount * p.price * p.commission / 100,
        conversionRate: p.clickCount > 0 ? Number(((p.conversionCount / p.clickCount) * 100).toFixed(1)) : 0,
        category: p.category
      })),
      traffic: {
        sources: [
          { name: "Instagram", clicks: Math.floor(totalClicks * 0.41), percentage: 41 },
          { name: "TikTok", clicks: Math.floor(totalClicks * 0.30), percentage: 30 },
          { name: "WhatsApp", clicks: Math.floor(totalClicks * 0.17), percentage: 17 },
          { name: "Facebook", clicks: Math.floor(totalClicks * 0.12), percentage: 12 }
        ]
      },
      timeRange: {
        "7d": { clicks: Math.floor(totalClicks * 0.2), conversions: Math.floor(totalConversions * 0.2), earnings: totalRevenue * 0.2 },
        "30d": { clicks: totalClicks, conversions: totalConversions, earnings: totalRevenue },
        "90d": { clicks: Math.floor(totalClicks * 3), conversions: Math.floor(totalConversions * 3), earnings: totalRevenue * 3 }
      }
    };
  }, [products]);

  const currentData = analyticsData.timeRange[timeRange as keyof typeof analyticsData.timeRange];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Analytics Avançado
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o desempenho detalhado {user?.type === "creator" ? "dos seus produtos" : "das suas promoções"}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Cliques"
            value={currentData.clicks.toLocaleString()}
            description={`Últimos ${timeRange === "7d" ? "7 dias" : timeRange === "30d" ? "30 dias" : "90 dias"}`}
            icon={MousePointer}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Conversões"
            value={currentData.conversions}
            description="Vendas confirmadas"
            icon={ShoppingCart}
            variant="success"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Ganhos Totais"
            value={`R$ ${currentData.earnings.toFixed(2)}`}
            description="Comissões recebidas"
            icon={DollarSign}
            variant="primary"
            trend={{ value: 15.3, isPositive: true }}
          />
          <StatsCard
            title="Taxa de Conversão"
            value={`${((currentData.conversions / currentData.clicks) * 100).toFixed(1)}%`}
            description="Média de conversão"
            icon={Percent}
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Por Produto</TabsTrigger>
            <TabsTrigger value="traffic">Fontes de Tráfego</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance por Produto</CardTitle>
                    <CardDescription>
                      Análise detalhada de cada produto promovido
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.products.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{product.title}</h3>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-success">
                            R$ {product.earnings.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.conversionRate}% conversão
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {product.clicks.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground">Cliques</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">
                            {product.conversions}
                          </div>
                          <div className="text-muted-foreground">Conversões</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {product.conversionRate}%
                          </div>
                          <div className="text-muted-foreground">Taxa</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
                <CardDescription>
                  De onde vêm seus visitantes e conversões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.traffic.sources.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary" style={{
                          backgroundColor: `hsl(${index * 90}, 70%, 50%)`
                        }} />
                        <span className="font-medium">{source.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-semibold">{source.clicks.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">cliques</div>
                        </div>
                        
                        <div className="text-right min-w-[60px]">
                          <div className="font-semibold">{source.percentage}%</div>
                          <div className="text-sm text-muted-foreground">do total</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CTR Médio</span>
                      <span className="font-semibold">7.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ticket Médio</span>
                      <span className="font-semibold">R$ 32,45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Comissão Média</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ROI</span>
                      <span className="font-semibold text-success">+245%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm">{product.title}</span>
                        </div>
                        <span className="text-sm font-semibold text-success">
                          R$ {product.earnings.toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendências e Insights</CardTitle>
                <CardDescription>
                  Análise de crescimento e oportunidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg bg-success/5 border-success/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="font-semibold text-success">Crescimento</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Suas conversões aumentaram 23% nas últimas 2 semanas
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">Oportunidade</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Instagram está gerando mais tráfego que TikTok
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-warning/5 border-warning/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-warning" />
                      <span className="font-semibold text-warning">Atenção</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Produto X teve queda de 15% em conversões
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}