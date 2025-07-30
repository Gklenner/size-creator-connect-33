import { useCallback } from "react";
import { useStore } from "@/store/useStore";
import { User } from "@/types";
import { LoginFormData, RegisterFormData } from "@/lib/validations";
import { PasswordManager, SessionManager, RateLimiter, DataEncryption } from "@/lib/crypto";
import { SecurityValidator } from "@/lib/security";
import { analytics } from "@/services/analytics";

// Mock database simulation
const USERS_KEY = 'size_users';
const USER_KEY = 'size_user';

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

  const login = useCallback(async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    
    try {
      // Enhanced security validations
      if (!SecurityValidator.isValidEmail(data.email)) {
        throw new Error('Email inválido');
      }

      // Rate limiting check
      const rateLimitCheck = RateLimiter.checkRateLimit(data.email);
      if (!rateLimitCheck.allowed) {
        const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
        throw new Error(`Muitas tentativas. Tente novamente em ${minutes} minutos.`);
      }

      // Record attempt for rate limiting
      RateLimiter.recordAttempt(data.email);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Get existing users (encrypted)
      const encryptedUsers = localStorage.getItem(USERS_KEY);
      const existingUsers: User[] = encryptedUsers 
        ? DataEncryption.decryptObject<User[]>(encryptedUsers) || []
        : [];
      
      const existingUser = existingUsers.find(u => u.email === data.email);
      
      if (!existingUser) {
        throw new Error('Usuário não encontrado. Faça seu cadastro primeiro.');
      }

      // Check password with bcrypt
      const encryptedPassword = localStorage.getItem(`size_password_${existingUser.uid}`);
      if (!encryptedPassword) {
        throw new Error('Erro de autenticação');
      }

      const storedPassword = DataEncryption.decrypt(encryptedPassword);
      const isPasswordValid = await PasswordManager.verify(data.password, storedPassword);
      
      if (!isPasswordValid) {
        throw new Error('Senha incorreta');
      }
      
      // Clear rate limiting on successful login
      RateLimiter.clearAttempts(data.email);

      // Create secure session
      const sessionId = SessionManager.createSession(existingUser.uid);
      
      // Update last login
      const updatedUser = {
        ...existingUser,
        lastLogin: new Date(),
      };
      
      setUser(updatedUser);
      
      // Store encrypted user data
      const encryptedUserData = DataEncryption.encryptObject(updatedUser);
      localStorage.setItem(USER_KEY, encryptedUserData);
      localStorage.setItem('size_last_login', new Date().toISOString());
      
      // Track login event
      analytics.trackUserAction('login', {
        userId: updatedUser.uid,
        userType: updatedUser.type
      });
      
      addNotification({
        type: 'success',
        message: `Bem-vindo de volta, ${updatedUser.name}!`
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
  }, [setUser, setLoading, addNotification]);

  const register = useCallback(async (data: RegisterFormData): Promise<void> => {
    setLoading(true);
    
    try {
      // Enhanced security validations
      if (!SecurityValidator.isValidEmail(data.email)) {
        throw new Error('Email inválido');
      }

      const passwordValidation = SecurityValidator.validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(`Senha fraca: ${passwordValidation.feedback.join(', ')}`);
      }

      // Sanitize input data
      const sanitizedName = SecurityValidator.sanitizeInput(data.name);
      const sanitizedEmail = data.email.toLowerCase().trim();

      // Rate limiting check
      const rateLimitCheck = RateLimiter.checkRateLimit(sanitizedEmail);
      if (!rateLimitCheck.allowed) {
        const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
        throw new Error(`Muitas tentativas. Tente novamente em ${minutes} minutos.`);
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get existing users (encrypted)
      const encryptedUsers = localStorage.getItem(USERS_KEY);
      const existingUsers: User[] = encryptedUsers 
        ? DataEncryption.decryptObject<User[]>(encryptedUsers) || []
        : [];
      
      // Check if email already exists
      if (existingUsers.find(u => u.email === sanitizedEmail)) {
        throw new Error('Este email já está cadastrado');
      }

      // Hash password
      const hashedPassword = await PasswordManager.hash(data.password);

      // Create new user
      const newUser: User = {
        uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: sanitizedName,
        email: sanitizedEmail,
        type: data.type,
        createdAt: new Date(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sanitizedName)}`,
        bio: data.type === 'creator' 
          ? 'Criador de produtos digitais' 
          : 'Afiliado especializado em marketing digital',
      };
      
      // Save user (encrypted)
      existingUsers.push(newUser);
      const encryptedUsersList = DataEncryption.encryptObject(existingUsers);
      localStorage.setItem(USERS_KEY, encryptedUsersList);
      
      // Save encrypted password
      const encryptedPassword = DataEncryption.encrypt(hashedPassword);
      localStorage.setItem(`size_password_${newUser.uid}`, encryptedPassword);
      
      // Create secure session
      SessionManager.createSession(newUser.uid);
      
      setUser(newUser);
      
      // Store encrypted user data
      const encryptedUserData = DataEncryption.encryptObject(newUser);
      localStorage.setItem(USER_KEY, encryptedUserData);
      
      // Track signup event
      analytics.trackUserAction('signup', {
        userId: newUser.uid,
        userType: newUser.type
      });
      
      addNotification({
        type: 'success',
        message: `Conta criada com sucesso! Bem-vindo, ${newUser.name}!`
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
  }, [setUser, setLoading, addNotification]);

  const logout = useCallback(() => {
    // Clear secure session
    SessionManager.clearSession();
    
    storeLogout();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('size_last_login');
    
    addNotification({
      type: 'success',
      message: 'Logout realizado com sucesso'
    });
  }, [storeLogout, addNotification]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      const existingUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const updatedUsers = existingUsers.map(u => 
        u.uid === user.uid ? updatedUser : u
      );
      
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      
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
    setLoading(true);
    
    try {
      // Validate session first
      const validUserId = SessionManager.validateSession();
      if (!validUserId) {
        // Session invalid, clear everything
        storeLogout();
        localStorage.removeItem(USER_KEY);
        setLoading(false);
        return;
      }

      // Check if user is stored and decrypt
      const encryptedUser = localStorage.getItem(USER_KEY);
      if (encryptedUser) {
        const decryptedUser = DataEncryption.decryptObject<User>(encryptedUser);
        if (decryptedUser && decryptedUser.uid === validUserId) {
          setUser(decryptedUser);
        } else {
          // Data corruption or session mismatch
          SessionManager.clearSession();
          localStorage.removeItem(USER_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      SessionManager.clearSession();
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, storeLogout]);

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