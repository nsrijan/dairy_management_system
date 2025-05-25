import { Role } from '@/constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
} 