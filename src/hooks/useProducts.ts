import { useCallback, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";
import { ProductFormData } from "@/lib/validations";

const PRODUCTS_KEY = 'size_products';

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

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem(PRODUCTS_KEY);
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    } else {
      // Initialize with mock data
      setProducts(generateMockProducts());
    }
  }, [setProducts]);

  const createProduct = useCallback(async (data: ProductFormData): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProduct: Product = {
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        creatorId: user.uid,
        title: data.title,
        description: data.description,
        affiliateLink: data.affiliateLink,
        category: data.category,
        commission: data.commission,
        price: data.price,
        materials: {
          instagram: [],
          tiktok: [],
          email: [],
          banners: [],
        },
        createdAt: new Date(),
        isActive: true,
        clickCount: 0,
        conversionCount: 0,
      };

      addProduct(newProduct);
      
      // Save to localStorage
      const updatedProducts = [...products, newProduct];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
      
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
  }, [user, products, addProduct, addNotification]);

  const editProduct = useCallback(async (productId: string, data: Partial<ProductFormData>): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      updateProduct(productId, data);
      
      // Save to localStorage
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, ...data } : p
      );
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
      
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
  }, [user, products, updateProduct, addNotification]);

  const removeProduct = useCallback(async (productId: string): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      deleteProduct(productId);
      
      // Save to localStorage
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
      
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
  }, [user, products, deleteProduct, addNotification]);

  const toggleProductStatus = useCallback(async (productId: string): Promise<void> => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      const newStatus = !product.isActive;
      updateProduct(productId, { isActive: newStatus });
      
      // Save to localStorage
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, isActive: newStatus } : p
      );
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
      
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
  }, [products, updateProduct, addNotification]);

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