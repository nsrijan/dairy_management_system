'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { logoutUser } from '@/features/auth/login/loginService';

// Theme Context
type Theme = 'light' | 'dark';
type AccentColor = 'teal' | 'blue' | 'purple' | 'rose';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Auth Context
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string, user: User, tenant?: Tenant) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accentColor, setAccentColorState] = useState<AccentColor>('teal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedColor = localStorage.getItem('accentColor') as AccentColor | null;

    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    if (savedColor) {
      setAccentColorState(savedColor);
      document.documentElement.setAttribute('data-accent', savedColor);
    } else {
      document.documentElement.setAttribute('data-accent', 'teal');
    }

    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem('accentColor', color);
    document.documentElement.setAttribute('data-accent', color);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage or cookies
    const storedToken = localStorage.getItem('auth_token') || getCookie('auth_token');

    if (storedToken) {
      console.log('Found authentication token in storage');
      setToken(storedToken);
      // Try to get user info from localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Auto-logged in user:', parsedUser.name, 'with role:', parsedUser.role);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }

      // Try to get tenant info from localStorage if available
      const storedTenant = localStorage.getItem('tenant');
      if (storedTenant) {
        try {
          const parsedTenant = JSON.parse(storedTenant);
          console.log('Auto-loaded tenant:', parsedTenant.name);
          setTenant(parsedTenant);
        } catch (e) {
          console.error('Failed to parse stored tenant', e);
        }
      }
      // In a real app, you might want to validate the token with the server here
    }

    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, newTenant?: Tenant) => {
    setToken(newToken);
    setUser(newUser);
    setTenant(newTenant || null);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    if (newTenant) {
      localStorage.setItem('tenant', JSON.stringify(newTenant));
    }
    // Conditionally set the secure flag
    const cookieOptions = `path=/; max-age=86400${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    document.cookie = `auth_token=${newToken}; ${cookieOptions}`;
  };
  const logout = async () => {
    // Call backend to invalidate the token
    try {
      await logoutUser(token);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local state regardless of backend success
      setToken(null);
      setUser(null);
      setTenant(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('tenant');
      const cookieClearOptions = `path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      document.cookie = `auth_token=; ${cookieClearOptions}`;
    }
  };

  // Helper function to get cookie value by name
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Query Provider
function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Combined Providers
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
} 