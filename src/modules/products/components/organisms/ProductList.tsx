import React from 'react';
import { ProductCard } from '@/shared/components/molecules/ProductCard';
import { Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { Loader } from '@/shared/components/atoms/Loader';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { Search, Filter } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

const categories = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'educação', label: 'Educação' },
  { value: 'e-book', label: 'E-book' },
  { value: 'mentoria', label: 'Mentoria' },
  { value: 'ferramentas', label: 'Ferramentas' },
  { value: 'curso', label: 'Curso' },
];

export const ProductList: React.FC = () => {
  const { 
    filteredProducts, 
    searchQuery, 
    selectedCategory, 
    isLoading,
    setSearchQuery,
    setSelectedCategory 
  } = useProducts();
  
  const { profile } = useAuth();
  const { addNotification } = useNotificationStore();

  const handleCopyLink = (product: Product) => {
    const affiliateLink = `${product.affiliate_link}?ref=${profile?.id}`;
    navigator.clipboard.writeText(affiliateLink);
    
    addNotification({
      type: 'success',
      message: 'Link copiado para área de transferência!'
    });
  };

  const handlePreview = (product: Product) => {
    window.open(product.affiliate_link, '_blank');
  };

  const handleViewAnalytics = (product: Product) => {
    // TODO: Navigate to analytics page
    console.log('View analytics for:', product.id);
  };

  const handleShare = (product: Product) => {
    // TODO: Open share modal
    console.log('Share product:', product.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="products-loading">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-2 text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="product-list">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            data-testid="category-filter"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12" data-testid="no-products">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Nenhum produto encontrado com os filtros aplicados.'
              : 'Nenhum produto disponível no momento.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              userType={profile?.type as 'affiliate' | 'creator' || 'affiliate'}
              onCopyLink={handleCopyLink}
              onPreview={handlePreview}
              onViewAnalytics={handleViewAnalytics}
              onShare={handleShare}
            />
          ))}
        </div>
      )}
    </div>
  );
};