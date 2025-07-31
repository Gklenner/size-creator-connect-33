import { useAuthStore } from './authStore';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationStore } from '@/shared/store/notificationStore';
import type { AuthError } from '@supabase/supabase-js';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  type: 'affiliate' | 'creator';
}

export const useAuthActions = () => {
  const { setUser, setSession, setProfile, setLoading, reset } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        setSession(data.session);
        await loadProfile(data.user.id);
        
        addNotification({
          type: 'success',
          message: 'Login realizado com sucesso!'
        });
      }
    } catch (error) {
      const message = (error as AuthError).message || 'Erro no login';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: credentials.name,
            type: credentials.type,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        addNotification({
          type: 'success',
          message: 'Conta criada com sucesso! Verifique seu email.'
        });
      }
    } catch (error) {
      const message = (error as AuthError).message || 'Erro no cadastro';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      reset();
      addNotification({
        type: 'success',
        message: 'Logout realizado com sucesso!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro ao fazer logout'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          type: data.type,
          avatar_url: data.avatar_url,
          bio: data.bio,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<{ name: string; bio: string; avatar_url: string }>): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('Usuário não autenticado');

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadProfile(user.id);
      
      addNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro ao atualizar perfil'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };
};