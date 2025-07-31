import { create } from 'zustand';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
}

interface ProductStore extends ProductState {
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
  filterProducts: () => void;
  reset: () => void;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: false,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  ...initialState,
  
  setProducts: (products) => {
    set({ products });
    get().filterProducts();
  },
  
  addProduct: (product) => {
    const products = [...get().products, product];
    set({ products });
    get().filterProducts();
  },
  
  updateProduct: (id, updates) => {
    const products = get().products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    set({ products });
    get().filterProducts();
  },
  
  deleteProduct: (id) => {
    const products = get().products.filter(p => p.id !== id);
    set({ products });
    get().filterProducts();
  },
  
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterProducts();
  },
  
  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory });
    get().filterProducts();
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  filterProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    set({ filteredProducts: filtered });
  },
  
  reset: () => set(initialState),
}));

// Selectors
export const useProductState = () => {
  const { products, filteredProducts, searchQuery, selectedCategory, isLoading } = useProductStore();
  return { products, filteredProducts, searchQuery, selectedCategory, isLoading };
};