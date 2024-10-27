// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for token and decode user data if available
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = decodeToken(token);
      console.log('decodedUser', decodedUser);
      if (decodedUser) {
        setUser(decodedUser);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const decodeToken = (token: string): User | null => {
    try {
      return jwtDecode<User>(token); // Decode and return the user data
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      setUser(decodedUser);
      setIsAuthenticated(true);
    }
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
