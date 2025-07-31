import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '../atoms/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Eye, Copy, BarChart3, Share2, ExternalLink } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  userType: 'affiliate' | 'creator';
  onCopyLink?: (product: Product) => void;
  onViewAnalytics?: (product: Product) => void;
  onShare?: (product: Product) => void;
  onPreview?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userType,
  onCopyLink,
  onViewAnalytics,
  onShare,
  onPreview,
  className
}) => {
  const conversionRate = product.click_count > 0 
    ? ((product.conversion_count / product.click_count) * 100).toFixed(1)
    : '0.0';

  return (
    <Card className={className} data-testid="product-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          <Badge variant={product.is_active ? 'default' : 'secondary'}>
            {product.is_active ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-medium">{product.click_count}</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div>
              <div className="text-sm font-medium">{product.conversion_count}</div>
              <div className="text-xs text-muted-foreground">Conversões</div>
            </div>
            <div>
              <div className="text-sm font-medium">{conversionRate}%</div>
              <div className="text-xs text-muted-foreground">Taxa</div>
            </div>
          </div>

          {/* Category and Commission */}
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{product.category}</Badge>
            <span className="font-medium text-green-600">
              {product.commission}% comissão
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-lg font-bold">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          {/* Materials */}
          {product.materials && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Materiais disponíveis:</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(product.materials as Record<string, unknown>).map(([type, items]) => {
                  if (Array.isArray(items) && items.length > 0) {
                    return (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type === 'instagram' ? 'Instagram' : 
                         type === 'tiktok' ? 'TikTok' : 
                         type === 'email' ? 'Email' : 
                         type === 'banners' ? 'Banners' : type}
                      </Badge>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex gap-2 w-full">
          {userType === 'affiliate' ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => onCopyLink?.(product)}
                className="flex-1"
                data-testid="copy-link-button"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copiar Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview?.(product)}
                data-testid="preview-button"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewAnalytics?.(product)}
                className="flex-1"
                data-testid="analytics-button"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare?.(product)}
                data-testid="share-button"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};