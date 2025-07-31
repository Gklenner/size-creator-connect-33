import React from 'react';
import { ProductList } from '../components/organisms/ProductList';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/atoms/Button';
import { Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductsPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6" data-testid="products-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Package className="h-8 w-8 mr-3" />
            Produtos
          </h1>
          <p className="text-muted-foreground">
            {profile?.type === 'creator' 
              ? 'Gerencie seus produtos digitais'
              : 'Encontre produtos para promover como afiliado'
            }
          </p>
        </div>
        
        {profile?.type === 'creator' && (
          <Button asChild>
            <Link to="/products/create">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        )}
      </div>

      {/* Product List */}
      <ProductList />
    </div>
  );
};