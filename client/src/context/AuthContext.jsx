import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/authApi';
import { getToken, setToken, setUser, getUser, clearAuth } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(!!getToken());

  // Verify token and fetch fresh user on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await getCurrentUser();
        const fetchedUser = res.data.user;
        setUserState(fetchedUser);
        setUser(fetchedUser);
      } catch {
        clearAuth();
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setUserState(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
