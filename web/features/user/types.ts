export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  phoneNumber?: string;
  address?: string;
  joinDate: string;
}

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
} 