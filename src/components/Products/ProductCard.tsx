import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Eye, 
  TrendingUp, 
  Share2, 
  ExternalLink,
  Download 
} from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
  userType: "affiliate" | "creator";
  affiliateId?: string;
}

export function ProductCard({ product, userType, affiliateId }: ProductCardProps) {
  const { toast } = useToast();

  const affiliateLink = `${product.affiliateLink}?ref=${affiliateId}`;
  
  const copyAffiliateLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      
      // Update click count via Supabase
      await supabase
        .from('products')
        .update({ click_count: product.clickCount + 1 })
        .eq('id', product.id);
      
      toast({
        title: "Link copiado!",
        description: "Link copiado! Clique registrado no sistema.",
      });
    } catch (error) {
      console.error('Error updating click count:', error);
      toast({
        title: "Link copiado!",
        description: "Link copiado para a área de transferência.",
      });
    }
  };

  const handlePreview = async () => {
    window.open(product.affiliateLink, '_blank');
    
    // Update click count via Supabase
    try {
      await supabase
        .from('products')
        .update({ click_count: product.clickCount + 1 })
        .eq('id', product.id);
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };

  const conversionRate = product.clickCount > 0 
    ? ((product.conversionCount / product.clickCount) * 100).toFixed(1)
    : "0.0";

  return (
    <Card className="hover:shadow-glow transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {product.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{product.clickCount}</div>
            <div className="text-xs text-muted-foreground">Cliques</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">{product.conversionCount}</div>
            <div className="text-xs text-muted-foreground">Conversões</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Taxa</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Categoria:</span>
          <Badge variant="outline">{product.category}</Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Comissão:</span>
          <span className="font-semibold text-success">{product.commission}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Preço:</span>
          <span className="font-semibold">R$ {product.price.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {userType === "affiliate" && (
            <>
              <Button 
                onClick={copyAffiliateLink}
                className="w-full bg-gradient-primary hover:opacity-90"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link de Afiliado
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Em breve", description: "Materiais em desenvolvimento" })}>
                  <Download className="w-4 h-4 mr-1" />
                  Materiais
                </Button>
                <Button variant="outline" size="sm" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            </>
          )}
          
          {userType === "creator" && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/analytics'}>
                <TrendingUp className="w-4 h-4 mr-1" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={copyAffiliateLink}>
                <Share2 className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          )}
        </div>

        {/* Materials Preview */}
        {product.materials && (
          <div className="border-t pt-3">
            <div className="text-xs text-muted-foreground mb-2">Materiais disponíveis:</div>
            <div className="flex flex-wrap gap-1">
              {product.materials.instagram.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {product.materials.instagram.length} Instagram
                </Badge>
              )}
              {product.materials.tiktok.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {product.materials.tiktok.length} TikTok
                </Badge>
              )}
              {product.materials.email.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {product.materials.email.length} Email
                </Badge>
              )}
              {product.materials.banners.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {product.materials.banners.length} Banners
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}