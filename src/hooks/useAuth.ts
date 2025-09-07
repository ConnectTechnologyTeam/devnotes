import { useState, useEffect } from 'react';
import { mockAuth, mockArticleService, User } from '@/lib/mockData';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh user data from localStorage on mount
    const refreshUser = () => {
      const currentUser = mockAuth.refreshUser();
      setUser(currentUser);
      // Also refresh articles when user is loaded
      mockArticleService.refreshArticles();
      setLoading(false);
    };

    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await mockAuth.login(email, password);
      setUser(user);
      // Refresh articles when user logs in
      mockArticleService.refreshArticles();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const user = await mockAuth.register(email, password, name);
      setUser(user);
      // Refresh articles when user registers
      mockArticleService.refreshArticles();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };
};
