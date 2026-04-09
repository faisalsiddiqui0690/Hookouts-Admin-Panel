import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { AdminUser } from '../services/authService';

interface UseAuthReturn {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      // Check if authenticated (this will also check token expiry)
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          // User data missing, clear auth
          authService.clearAuth();
        }
      } else {
        // Not authenticated or token expired, clear any remaining data
        authService.clearAuth();
      }
      setLoading(false);
    };

    initAuth();
    
    // Set up periodic token validation (check every minute)
    const intervalId = setInterval(() => {
      if (!authService.isAuthenticated()) {
        // Token expired, logout user
        setUser(null);
        authService.clearAuth();
        navigate('/login');
      }
    }, 60000); // Check every 60 seconds
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Token and user are already stored in authService.login
        const completeUser: AdminUser = {
          id: response.data.user.id,
          email: response.data.user.email,
          role: response.data.user.role,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        
        setUser(completeUser);
        navigate('/dashboard');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  // Role checkers
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isModerator = user?.role === 'MODERATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user && authService.isAuthenticated(),
    hasRole,
    isSuperAdmin,
    isAdmin,
    isModerator,
  };
};
