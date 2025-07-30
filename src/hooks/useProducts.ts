import { useCallback, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import { ProductFormData } from "@/lib/validations";
import { supabase } from "@/integrations/supabase/client";

// Transform Supabase product to app product format
const transformProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  creatorId: dbProduct.creator_id,
  title: dbProduct.title,
  description: dbProduct.description,
  affiliateLink: dbProduct.affiliate_link,
  category: dbProduct.category,
  commission: Number(dbProduct.commission),
  price: Number(dbProduct.price),
  materials: dbProduct.materials || {
    instagram: [],
    tiktok: [],
    email: [],
    banners: [],
  },
  createdAt: new Date(dbProduct.created_at),
  isActive: dbProduct.is_active,
  clickCount: dbProduct.click_count,
  conversionCount: dbProduct.conversion_count,
});

export const useProducts = () => {
  const { 
    user,
    products, 
    filteredProducts,
    searchQuery,
    selectedCategory,
    setProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    setSearchQuery,
    setSelectedCategory,
    addNotification 
  } = useStore();

  // Load products from Supabase on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading products:', error);
          // Fallback to mock data if needed for development
          setProducts(generateMockProducts());
          return;
        }

        const transformedProducts = data.map(transformProduct);
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(generateMockProducts());
      }
    };

    loadProducts();
  }, [setProducts]);

  const createProduct = useCallback(async (data: ProductFormData): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          creator_id: user.uid,
          title: data.title,
          description: data.description,
          affiliate_link: data.affiliateLink,
          category: data.category,
          commission: data.commission,
          price: data.price,
          materials: {
            instagram: [],
            tiktok: [],
            email: [],
            banners: [],
          },
        })
        .select()
        .single();

      if (error) {
        throw new Error('Erro ao criar produto');
      }

      const transformedProduct = transformProduct(newProduct);
      addProduct(transformedProduct);
      
      addNotification({
        type: 'success',
        message: 'Produto criado com sucesso!'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar produto';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    }
  }, [user, addProduct, addNotification]);

  const editProduct = useCallback(async (productId: string, data: Partial<ProductFormData>): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.affiliateLink) updateData.affiliate_link = data.affiliateLink;
      if (data.category) updateData.category = data.category;
      if (data.commission !== undefined) updateData.commission = data.commission;
      if (data.price !== undefined) updateData.price = data.price;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .eq('creator_id', user.uid);

      if (error) {
        throw new Error('Erro ao atualizar produto');
      }

      updateProduct(productId, data);
      
      addNotification({
        type: 'success',
        message: 'Produto atualizado com sucesso!'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar produto';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    }
  }, [user, updateProduct, addNotification]);

  const removeProduct = useCallback(async (productId: string): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('creator_id', user.uid);

      if (error) {
        throw new Error('Erro ao remover produto');
      }

      deleteProduct(productId);
      
      addNotification({
        type: 'success',
        message: 'Produto removido com sucesso!'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover produto';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    }
  }, [user, deleteProduct, addNotification]);

  const toggleProductStatus = useCallback(async (productId: string): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      const newStatus = !product.isActive;
      
      const { error } = await supabase
        .from('products')
        .update({ is_active: newStatus })
        .eq('id', productId)
        .eq('creator_id', user.uid);

      if (error) {
        throw new Error('Erro ao alterar status do produto');
      }

      updateProduct(productId, { isActive: newStatus });
      
      addNotification({
        type: 'success',
        message: `Produto ${newStatus ? 'ativado' : 'desativado'} com sucesso!`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao alterar status do produto';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    }
  }, [user, products, updateProduct, addNotification]);

  // Get user's products (for creators)
  const getUserProducts = useCallback(() => {
    if (!user) return [];
    return products.filter(p => p.creatorId === user.uid);
  }, [user, products]);

  // Get available products (for affiliates)
  const getAvailableProducts = useCallback(() => {
    return products.filter(p => p.isActive);
  }, [products]);

  return {
    products,
    filteredProducts,
    searchQuery,
    selectedCategory,
    createProduct,
    editProduct,
    removeProduct,
    toggleProductStatus,
    getUserProducts,
    getAvailableProducts,
    setSearchQuery,
    setSelectedCategory,
  };
};

// Mock data generator
function generateMockProducts(): Product[] {
  return [
    {
      id: "1",
      creatorId: "creator1",
      title: "Curso Completo de Marketing Digital",
      description: "Aprenda as melhores estratégias de marketing digital para alavancar seus negócios online com técnicas comprovadas.",
      affiliateLink: "https://exemplo.com/produto1",
      category: "Educação",
      commission: 30,
      materials: {
        instagram: ["post1.jpg", "story1.jpg", "reels1.mp4"],
        tiktok: ["video1.mp4", "video2.mp4"],
        email: ["template1.html", "template2.html"],
        banners: ["banner1.jpg", "banner2.jpg", "banner3.jpg"]
      },
      createdAt: new Date("2024-01-15"),
      isActive: true,
      clickCount: 1247,
      conversionCount: 89,
      price: 497.00
    },
    {
      id: "2",
      creatorId: "creator2",
      title: "E-book: Vendas no Digital",
      description: "Guia completo para aumentar suas vendas no ambiente digital com estratégias práticas e eficazes.",
      affiliateLink: "https://exemplo.com/produto2",
      category: "E-book",
      commission: 40,
      materials: {
        instagram: ["post2.jpg", "story2.jpg"],
        tiktok: ["video3.mp4"],
        email: ["template3.html"],
        banners: ["banner4.jpg", "banner5.jpg"]
      },
      createdAt: new Date("2024-01-20"),
      isActive: true,
      clickCount: 856,
      conversionCount: 67,
      price: 97.00
    },
    {
      id: "3",
      creatorId: "creator3",
      title: "Mentoria em Copywriting",
      description: "Mentoria exclusiva para dominar a arte da escrita persuasiva e aumentar suas conversões exponencialmente.",
      affiliateLink: "https://exemplo.com/produto3",
      category: "Mentoria",
      commission: 25,
      materials: {
        instagram: ["post3.jpg", "story3.jpg", "reels2.mp4"],
        tiktok: ["video4.mp4", "video5.mp4"],
        email: ["template4.html", "template5.html"],
        banners: ["banner6.jpg"]
      },
      createdAt: new Date("2024-02-01"),
      isActive: true,
      clickCount: 2103,
      conversionCount: 156,
      price: 1997.00
    },
    {
      id: "4",
      creatorId: "creator4",
      title: "Planilha de Gestão Financeira",
      description: "Controle completo das suas finanças pessoais e empresariais com nossa planilha profissional.",
      affiliateLink: "https://exemplo.com/produto4",
      category: "Ferramentas",
      commission: 50,
      materials: {
        instagram: ["post4.jpg"],
        tiktok: ["video6.mp4"],
        email: ["template6.html"],
        banners: ["banner7.jpg", "banner8.jpg"]
      },
      createdAt: new Date("2024-02-10"),
      isActive: true,
      clickCount: 634,
      conversionCount: 98,
      price: 47.00
    }
  ];
}