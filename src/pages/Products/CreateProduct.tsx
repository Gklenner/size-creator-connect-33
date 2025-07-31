import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  X, 
  Save, 
  Instagram, 
  PlayCircle, 
  Mail, 
  Image as ImageIcon 
} from "lucide-react";

const categories = [
  "Educação",
  "Marketing",
  "Tecnologia",
  "Design",
  "Negócios",
  "Saúde",
  "Fitness",
  "Culinária",
  "Finanças",
  "Desenvolvimento Pessoal"
];

export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [commission, setCommission] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  
  // Materials
  const [instagramMaterials, setInstagramMaterials] = useState<string[]>([]);
  const [tiktokMaterials, setTiktokMaterials] = useState<string[]>([]);
  const [emailMaterials, setEmailMaterials] = useState<string[]>([]);
  const [bannerMaterials, setBannerMaterials] = useState<string[]>([]);
  
  // Temporary inputs for adding materials
  const [newInstagram, setNewInstagram] = useState("");
  const [newTiktok, setNewTiktok] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBanner, setNewBanner] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const addMaterial = (type: string, value: string, setter: (fn: (prev: string[]) => string[]) => void, clearer: () => void) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()]);
      clearer();
    }
  };

  const removeMaterial = (type: string, index: number, setter: (fn: (prev: string[]) => string[]) => void) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.type !== "creator") {
      toast({
        title: "Erro",
        description: "Apenas produtores podem criar produtos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock product creation - substituir por Supabase
      const newProduct = {
        id: Math.random().toString(36).substr(2, 9),
        creatorId: user.uid,
        title,
        description,
        category,
        price: parseFloat(price),
        commission: parseFloat(commission),
        affiliateLink,
        materials: {
          instagram: instagramMaterials,
          tiktok: tiktokMaterials,
          email: emailMaterials,
          banners: bannerMaterials,
        },
        createdAt: new Date(),
        isActive: true,
        clickCount: 0,
        conversionCount: 0,
      };

      // Salvar no localStorage temporariamente
      const existingProducts = JSON.parse(localStorage.getItem('size_products') || '[]');
      existingProducts.push(newProduct);
      localStorage.setItem('size_products', JSON.stringify(existingProducts));

      toast({
        title: "Produto criado com sucesso!",
        description: `${title} foi criado e está ativo para afiliados.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro ao criar produto",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold">Criar Produto</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Defina as informações principais do seu produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Produto *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Curso de Marketing Digital"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva seu produto de forma atrativa para os afiliados..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="197.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commission">Comissão (%) *</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="1"
                    max="90"
                    placeholder="30"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="affiliate-link">Link do Produto *</Label>
                  <Input
                    id="affiliate-link"
                    type="url"
                    placeholder="https://seuproduto.com"
                    value={affiliateLink}
                    onChange={(e) => setAffiliateLink(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materials Section */}
          <Card>
            <CardHeader>
              <CardTitle>Materiais Promocionais</CardTitle>
              <CardDescription>
                Adicione materiais que ajudarão os afiliados a promover seu produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instagram Materials */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <Label className="text-base font-medium">Posts do Instagram</Label>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicionar texto para post..."
                    value={newInstagram}
                    onChange={(e) => setNewInstagram(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addMaterial("instagram", newInstagram, setInstagramMaterials, () => setNewInstagram(""))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {instagramMaterials.map((material, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {material.substring(0, 30)}{material.length > 30 ? "..." : ""}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => removeMaterial("instagram", index, setInstagramMaterials)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* TikTok Materials */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5 text-black" />
                  <Label className="text-base font-medium">Scripts TikTok</Label>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicionar script para TikTok..."
                    value={newTiktok}
                    onChange={(e) => setNewTiktok(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addMaterial("tiktok", newTiktok, setTiktokMaterials, () => setNewTiktok(""))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tiktokMaterials.map((material, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {material.substring(0, 30)}{material.length > 30 ? "..." : ""}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => removeMaterial("tiktok", index, setTiktokMaterials)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Email Materials */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <Label className="text-base font-medium">Templates de Email</Label>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicionar template de email..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addMaterial("email", newEmail, setEmailMaterials, () => setNewEmail(""))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {emailMaterials.map((material, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {material.substring(0, 30)}{material.length > 30 ? "..." : ""}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => removeMaterial("email", index, setEmailMaterials)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Banner Materials */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-green-500" />
                  <Label className="text-base font-medium">Banners</Label>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="URL do banner ou descrição..."
                    value={newBanner}
                    onChange={(e) => setNewBanner(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addMaterial("banner", newBanner, setBannerMaterials, () => setNewBanner(""))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bannerMaterials.map((material, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {material.substring(0, 30)}{material.length > 30 ? "..." : ""}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => removeMaterial("banner", index, setBannerMaterials)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Produto"}
              {!isLoading && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}