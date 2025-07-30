import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, DashboardStats, Referral } from '@/types';

interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Products State
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string;

  // Dashboard State
  stats: DashboardStats | null;
  referrals: Referral[];

  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setStats: (stats: DashboardStats) => void;
  setReferrals: (referrals: Referral[]) => void;
  addReferral: (referral: Referral) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  logout: () => void;
  filterProducts: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      products: [],
      filteredProducts: [],
      searchQuery: '',
      selectedCategory: 'all',
      stats: null,
      referrals: [],
      sidebarCollapsed: false,
      theme: 'light',
      notifications: [],

      // Auth Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      // Product Actions
      setProducts: (products) => {
        set({ products });
        get().filterProducts();
      },

      addProduct: (product) => {
        const products = [...get().products, product];
        set({ products });
        get().filterProducts();
      },

      updateProduct: (productId, updates) => {
        const products = get().products.map(p => 
          p.id === productId ? { ...p, ...updates } : p
        );
        set({ products });
        get().filterProducts();
      },

      deleteProduct: (productId) => {
        const products = get().products.filter(p => p.id !== productId);
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

      // Dashboard Actions
      setStats: (stats) => set({ stats }),

      setReferrals: (referrals) => set({ referrals }),

      addReferral: (referral) => {
        const referrals = [...get().referrals, referral];
        set({ referrals });
      },

      // UI Actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),

      setTheme: (theme) => set({ theme }),

      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(newNotification.id);
        }, 5000);
      },

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),

      // Logout Action
      logout: () => set({
        user: null,
        isAuthenticated: false,
        products: [],
        filteredProducts: [],
        stats: null,
        referrals: [],
        notifications: [],
      }),
    }),
    {
      name: 'size-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Computed selectors
export const useAuthStore = () => {
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isLoading = useStore((state) => state.isLoading);
  
  return { user, isAuthenticated, isLoading };
};

export const useProductsStore = () => {
  const products = useStore((state) => state.products);
  const filteredProducts = useStore((state) => state.filteredProducts);
  const searchQuery = useStore((state) => state.searchQuery);
  const selectedCategory = useStore((state) => state.selectedCategory);
  
  return { products, filteredProducts, searchQuery, selectedCategory };
};

export const useDashboardStore = () => {
  const stats = useStore((state) => state.stats);
  const referrals = useStore((state) => state.referrals);
  
  return { stats, referrals };
};

export const useUIStore = () => {
  const sidebarCollapsed = useStore((state) => state.sidebarCollapsed);
  const theme = useStore((state) => state.theme);
  const notifications = useStore((state) => state.notifications);
  
  return { sidebarCollapsed, theme, notifications };
};