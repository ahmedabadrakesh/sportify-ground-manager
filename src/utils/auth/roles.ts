
import { User } from "@/types/models";
import { getCurrentUser, getCurrentUserSync } from './user';

// Check if user has a specific role - async version
export const hasRole = async (role: User['role']): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  if (role === 'user') return true;
  if (role === 'admin') return user.role === 'admin' || user.role === 'super_admin';
  if (role === 'super_admin') return user.role === 'super_admin';
  if (role === 'ground_owner') return user.role === 'ground_owner';
  
  return false;
};

// Sync version for compatibility with existing code
export const hasRoleSync = (role: User['role']): boolean => {
  const user = getCurrentUserSync();
  if (!user) return false;
  
  if (role === 'user') return true;
  if (role === 'admin') return user.role === 'admin' || user.role === 'super_admin';
  if (role === 'super_admin') return user.role === 'super_admin';
  if (role === 'ground_owner') return user.role === 'ground_owner';
  
  return false;
};
