import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ProductCard } from "@/components/Products/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Plus,
  Filter,
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product, DashboardStats } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// Mock products - será substituído por dados reais do Supabase
const getInitialProducts = (): Product[] => [
  {
    id: "1",
    creatorId: "creator1",
    title: "Curso de Marketing Digital",
    description: "Aprenda as melhores estratégias de marketing digital para alavancar seus negócios online.",
    affiliateLink: "https://exemplo.com/produto1",
    category: "Educação",
    commission: 30,
    materials: {
      instagram: ["post1.jpg", "story1.jpg"],
      tiktok: ["video1.mp4"],
      email: ["template1.html"],
      banners: ["banner1.jpg", "banner2.jpg"]
    },
    createdAt: new Date(),
    isActive: true,
    clickCount: 234,
    conversionCount: 18,
    price: 197.00
  },
  {
    id: "2",
    creatorId: "creator2",
    title: "E-book: Vendas no Digital",
    description: "Guia completo para aumentar suas vendas no ambiente digital.",
    affiliateLink: "https://exemplo.com/produto2",
    category: "E-book",
    commission: 50,
    materials: {
      instagram: ["post2.jpg"],
      tiktok: [],
      email: ["template2.html"],
      banners: ["banner3.jpg"]
    },
    createdAt: new Date(),
    isActive: true,
    clickCount: 89,
    conversionCount: 12,
    price: 47.00
  }
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    activeProducts: 0,
    conversionRate: 0,
  });
  
  const { user, logout } = useAuth();

  useEffect(() => {
    // Carregar produtos do localStorage ou usar dados mock
    const savedProducts = localStorage.getItem('size_products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts);
    } else {
      const initialProducts = getInitialProducts();
      setProducts(initialProducts);
      localStorage.setItem('size_products', JSON.stringify(initialProducts));
    }

    // Calcular estatísticas baseadas nos produtos
    const calculateStats = (productList: Product[]) => {
      const totalClicks = productList.reduce((sum, p) => sum + p.clickCount, 0);
      const totalConversions = productList.reduce((sum, p) => sum + p.conversionCount, 0);
      const totalEarnings = productList.reduce((sum, p) => sum + (p.conversionCount * p.price * p.commission / 100), 0);
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      return {
        totalClicks,
        totalConversions,
        totalEarnings,
        activeProducts: productList.filter(p => p.isActive).length,
        conversionRate: Number(conversionRate.toFixed(1)),
      };
    };

    if (products.length > 0) {
      setStats(calculateStats(products));
    }
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="mb-4">Você precisa estar logado para acessar o dashboard.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={logout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            {user.type === "affiliate" 
              ? "Aqui você encontra os melhores produtos para promover e maximizar suas comissões."
              : "Gerencie seus produtos e acompanhe o desempenho dos seus afiliados."
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Cliques"
            value={stats.totalClicks}
            description="Este mês"
            icon={BarChart3}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Conversões"
            value={stats.totalConversions}
            description="Este mês"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Ganhos Totais"
            value={`R$ ${stats.totalEarnings.toFixed(2)}`}
            description="Este mês"
            icon={DollarSign}
            variant="primary"
            trend={{ value: 15.3, isPositive: true }}
          />
          <StatsCard
            title="Taxa de Conversão"
            value={`${stats.conversionRate}%`}
            description="Média geral"
            icon={Users}
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">
              {user.type === "affiliate" ? "Produtos Disponíveis" : "Meus Produtos"}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {user.type === "affiliate" ? "Produtos para Promover" : "Seus Produtos"}
                  </CardTitle>
                  {user.type === "creator" && (
                    <Link to="/products/create">
                      <Button className="bg-gradient-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userType={user.type}
                  affiliateId={user.uid}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? "Nenhum produto encontrado com os filtros aplicados."
                      : "Nenhum produto disponível no momento."
                    }
                  </div>
                  {user.type === "creator" && (
                    <Link to="/products/create">
                      <Button className="bg-gradient-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Produto
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analytics Detalhado</CardTitle>
                  <Link to="/analytics">
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver Completo
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.totalClicks}</div>
                    <div className="text-sm text-muted-foreground">Total de Cliques</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">{stats.totalConversions}</div>
                    <div className="text-sm text-muted-foreground">Conversões</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-accent">R$ {stats.totalEarnings.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Ganhos</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-warning">{stats.conversionRate}%</div>
                    <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
                  </div>
                </div>
                <div className="text-center text-muted-foreground">
                  📊 Clique em "Ver Completo" para análises detalhadas com gráficos e insights.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Central de Materiais</CardTitle>
                  <Link to="/materials">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Ver Todos
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-semibold">Instagram</div>
                    <div className="text-sm text-muted-foreground">Posts e Stories</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl mb-2">🎬</div>
                    <div className="font-semibold">TikTok</div>
                    <div className="text-sm text-muted-foreground">Scripts de Vídeo</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl mb-2">📧</div>
                    <div className="font-semibold">Email</div>
                    <div className="text-sm text-muted-foreground">Templates</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="font-semibold">Banners</div>
                    <div className="text-sm text-muted-foreground">Imagens</div>
                  </div>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  🎨 Clique em "Ver Todos" para acessar a biblioteca completa de materiais promocionais.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}