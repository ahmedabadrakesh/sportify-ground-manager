
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";

// Get current user from Supabase auth - async version
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Fetch user details from our users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();
      
      if (userData && !error) {
        // Store user in localStorage for compatibility
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return userData as User;
      }
      
      // Fallback to auth user if no profile exists
      const fallbackUser = {
        id: session.user.id,
        name: session.user.email?.split('@')[0] || session.user.phone?.split('@')[0] || 'User',
        email: session.user.email || '',
        phone: session.user.phone || '',
        role: 'user' as User['role']
      };
      
      localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
    
    // If no active session, check localStorage as fallback
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
  
  return null;
};

// Synchronous version for backward compatibility
export const getCurrentUserSync = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Check if user is authenticated - async version
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// Synchronous version for backward compatibility
export const isAuthenticatedSync = (): boolean => {
  return !!getCurrentUserSync();
};
