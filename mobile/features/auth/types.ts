export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
} 