
import { User, UserRole } from "@/types/models";
import { users } from "@/data/mockData";

// Mock authentication functions
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

export const login = (email: string, password: string): User | null => {
  // This is a mock function - in a real app, we would call an API
  // For demonstration, we'll just check if the email exists in our mock data
  const user = users.find(u => u.email === email);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (role === 'user') return true;
  if (role === 'admin') return user.role === 'admin' || user.role === 'super_admin';
  if (role === 'super_admin') return user.role === 'super_admin';
  
  return false;
};
