import { useProductStore } from './productStore';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export const useProductActions = () => {
  const { setProducts, addProduct, updateProduct, deleteProduct, setLoading } = useProductStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const loadProducts = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      addNotification({
        type: 'error',
        message: 'Erro ao carregar produtos'
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<ProductInsert, 'creator_id'>): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      addProduct(data);
      addNotification({
        type: 'success',
        message: 'Produto criado com sucesso!'
      });
    } catch (error) {
      console.error('Error creating product:', error);
      addNotification({
        type: 'error',
        message: 'Erro ao criar produto'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id: string, updates: ProductUpdate): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('creator_id', user.id)
        .select()
        .single();

      if (error) throw error;

      updateProduct(id, data);
      addNotification({
        type: 'success',
        message: 'Produto atualizado com sucesso!'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      addNotification({
        type: 'error',
        message: 'Erro ao atualizar produto'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string): Promise<void> => {
    if (!user) throw new Error('Usuário não autenticado');
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('creator_id', user.id);

      if (error) throw error;

      deleteProduct(id);
      addNotification({
        type: 'success',
        message: 'Produto removido com sucesso!'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      addNotification({
        type: 'error',
        message: 'Erro ao remover produto'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: string): Promise<void> => {
    const product = useProductStore.getState().products.find(p => p.id === id);
    if (!product) return;

    const newStatus = !product.is_active;
    
    try {
      await editProduct(id, { is_active: newStatus });
      
      addNotification({
        type: 'success',
        message: `Produto ${newStatus ? 'ativado' : 'desativado'} com sucesso!`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro ao alterar status do produto'
      });
    }
  };

  const getUserProducts = (): Product[] => {
    if (!user) return [];
    return useProductStore.getState().products.filter(p => p.creator_id === user.id);
  };

  const getAvailableProducts = (): Product[] => {
    return useProductStore.getState().products.filter(p => p.is_active);
  };

  return {
    loadProducts,
    createProduct,
    editProduct,
    removeProduct,
    toggleProductStatus,
    getUserProducts,
    getAvailableProducts,
  };
};