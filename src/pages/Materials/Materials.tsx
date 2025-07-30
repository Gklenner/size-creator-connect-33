import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Copy, 
  Download, 
  Search, 
  Filter,
  Instagram, 
  PlayCircle, 
  Mail, 
  Image as ImageIcon,
  Sparkles,
  Eye,
  Heart,
  Share2
} from "lucide-react";

// Mock materials data
const mockMaterials = {
  instagram: [
    {
      id: "1",
      productTitle: "Curso de Marketing Digital",
      content: "🚀 Transforme sua carreira com o melhor curso de Marketing Digital do Brasil! \n\n✅ + 50 horas de conteúdo\n✅ Certificado incluso\n✅ Suporte vitalício\n\n💰 Por apenas R$ 197 (de R$ 497)\n\n🔗 Link na bio para garantir sua vaga!\n\n#marketingdigital #curso #transformacao",
      type: "post",
      performance: { likes: 1250, comments: 89, saves: 234 }
    },
    {
      id: "2",
      productTitle: "E-book: Vendas no Digital",
      content: "💡 QUER VENDER MAIS ONLINE?\n\nBaixe GRÁTIS nosso e-book com as 7 estratégias que aumentaram nossas vendas em 300%!\n\n📱 Stories para saber como >>>\n\n#vendas #ebook #gratis #empreendedorismo",
      type: "story",
      performance: { views: 5670, clicks: 123 }
    }
  ],
  tiktok: [
    {
      id: "1",
      productTitle: "Curso de Marketing Digital",
      content: "HOOK: \"Eu aumentei minha renda em 500% em 6 meses\"\n\nCORPO:\n- Comecei do zero no marketing digital\n- Investi em conhecimento de qualidade\n- Apliquei as estratégias que aprendi\n- Os resultados chegaram rapidinho\n\nCTA: Link na bio para conhecer o curso que mudou minha vida!\n\n#marketingdigital #rendaextra #transformacao",
      type: "script",
      performance: { views: 125000, likes: 8900, shares: 450 }
    }
  ],
  email: [
    {
      id: "1",
      productTitle: "Curso de Marketing Digital",
      content: `Assunto: 🚨 Última chance para transformar sua carreira!\n\nOlá [NOME],\n\nEsta é sua ÚLTIMA OPORTUNIDADE de garantir sua vaga no curso de Marketing Digital com 50% de desconto.\n\n✅ O que você vai aprender:\n- Estratégias de tráfego pago\n- Copy que converte\n- Funis de vendas\n- E muito mais!\n\n🎯 OFERTA ESPECIAL:\nDe R$ 497 por apenas R$ 197\n\n[BOTÃO: QUERO GARANTIR MINHA VAGA]\n\nEssa oferta expira em 24h!\n\nAbraços,\n[SEU NOME]`,
      type: "template",
      performance: { openRate: 45.2, clickRate: 12.8 }
    }
  ],
  banners: [
    {
      id: "1",
      productTitle: "Curso de Marketing Digital",
      content: "Banner 1200x600 - Promoção especial",
      imageUrl: "/api/placeholder/600/300",
      type: "web",
      performance: { impressions: 50000, clicks: 2250 }
    },
    {
      id: "2", 
      productTitle: "E-book: Vendas no Digital",
      content: "Banner quadrado para feed - 1080x1080",
      imageUrl: "/api/placeholder/400/400",
      type: "social",
      performance: { impressions: 25000, clicks: 1100 }
    }
  ]
};

export default function Materials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copiado!",
        description: `${type} copiado para sua área de transferência.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  const downloadMaterial = (material: any) => {
    toast({
      title: "Download iniciado",
      description: "O material está sendo baixado.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Central de Materiais
              </h1>
              <p className="text-muted-foreground">
                Acesse materiais promocionais prontos para usar e maximize suas conversões
              </p>
            </div>
            
            <Button className="bg-gradient-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              IA Criativa
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar materiais..."
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

        {/* Materials Tabs */}
        <Tabs defaultValue="instagram" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="instagram" className="flex items-center space-x-2">
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4" />
              <span>TikTok</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>Banners</span>
            </TabsTrigger>
          </TabsList>

          {/* Instagram Materials */}
          <TabsContent value="instagram" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockMaterials.instagram.map((material) => (
                <Card key={material.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.productTitle}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-1">
                            {material.type === "post" ? "📱 Post" : "📖 Story"}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Instagram className="w-6 h-6 text-pink-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {material.content}
                      </pre>
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        {material.type === "post" ? (
                          <>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {material.performance.likes}
                            </span>
                            <span>💬 {material.performance.comments}</span>
                            <span>🔖 {material.performance.saves}</span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {material.performance.views}
                            </span>
                            <span>👆 {material.performance.clicks}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(material.content, "Post do Instagram")}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadMaterial(material)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TikTok Materials */}
          <TabsContent value="tiktok" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockMaterials.tiktok.map((material) => (
                <Card key={material.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.productTitle}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-1">
                            🎬 Script para vídeo
                          </Badge>
                        </CardDescription>
                      </div>
                      <PlayCircle className="w-6 h-6 text-black" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {material.content}
                      </pre>
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {material.performance.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {material.performance.likes}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          {material.performance.shares}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(material.content, "Script do TikTok")}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadMaterial(material)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Email Materials */}
          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {mockMaterials.email.map((material) => (
                <Card key={material.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.productTitle}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-1">
                            📧 Template de email
                          </Badge>
                        </CardDescription>
                      </div>
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {material.content}
                      </pre>
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>📬 Taxa de abertura: {material.performance.openRate}%</span>
                        <span>👆 Taxa de clique: {material.performance.clickRate}%</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(material.content, "Template de email")}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadMaterial(material)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Banner Materials */}
          <TabsContent value="banners" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMaterials.banners.map((material) => (
                <Card key={material.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{material.productTitle}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-1">
                            🖼️ {material.type === "web" ? "Banner Web" : "Banner Social"}
                          </Badge>
                        </CardDescription>
                      </div>
                      <ImageIcon className="w-5 h-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg text-center">
                      <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold">
                        Preview do Banner
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {material.content}
                      </p>
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>👁️ Impressões: {material.performance.impressions.toLocaleString()}</span>
                        <span>👆 Cliques: {material.performance.clicks}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadMaterial(material)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(material.imageUrl, "Link do banner")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Content Generator */}
        <Card className="mt-8 bg-gradient-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle>IA Criativa</CardTitle>
            </div>
            <CardDescription>
              Gere novos materiais personalizados com inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                🤖 Em breve: Gerador de materiais com IA
              </div>
              <p className="text-sm text-muted-foreground">
                Crie posts, stories, emails e banners personalizados automaticamente
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}