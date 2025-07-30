import { useCallback, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { User } from "@/types";
import { LoginFormData, RegisterFormData } from "@/lib/validations";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

// Transform Supabase user to app user format
const transformUser = (authUser: SupabaseUser, profile?: any): User => ({
  uid: authUser.id,
  name: profile?.name || authUser.email,
  email: authUser.email!,
  type: profile?.type || 'affiliate',
  createdAt: new Date(authUser.created_at),
  avatar: profile?.avatar_url,
  bio: profile?.bio,
});

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setLoading, 
    logout: storeLogout,
    addNotification 
  } = useStore();

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          const appUser = transformUser(session.user, profile);
          setUser(appUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const appUser = transformUser(session.user, profile);
            setUser(appUser);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  const login = useCallback(async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : 'Erro no login. Tente novamente.');
      }

      addNotification({
        type: 'success',
        message: 'Login realizado com sucesso!'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido no login';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addNotification]);

  const register = useCallback(async (data: RegisterFormData): Promise<void> => {
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: data.name,
            type: data.type,
          }
        }
      });

      if (error) {
        throw new Error(error.message === 'User already registered' 
          ? 'Este email já está cadastrado' 
          : 'Erro no cadastro. Tente novamente.');
      }

      addNotification({
        type: 'success',
        message: 'Conta criada com sucesso! Verifique seu email para ativar a conta.'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido no cadastro';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addNotification]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      storeLogout();
      
      addNotification({
        type: 'success',
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro no logout'
      });
    }
  }, [storeLogout, addNotification]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          bio: updates.bio,
          avatar_url: updates.avatar,
        })
        .eq('user_id', user.uid);

      if (error) {
        throw new Error('Erro ao atualizar perfil');
      }
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      addNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, setUser, setLoading, addNotification]);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    // This is now handled by the useEffect auth state listener
    // Keep for backward compatibility but does nothing
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };
};