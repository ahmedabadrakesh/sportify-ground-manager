
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/models";
import { users } from "@/data/mockData";

// Get current user from Supabase auth - async version
export const getCurrentUser = async (): Promise<User | null> => {
  // First check local storage for compatibility with existing code
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  
  // Then try to get from Supabase
  try {
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
      return {
        id: session.user.id,
        name: session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        phone: '',
        role: 'user'
      };
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

// Login with Supabase
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // First try to login with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error("Auth error:", authError);
      // Fallback to mock for demo purposes
      return mockLogin(email, password);
    }
    
    if (authData.user) {
      // Fetch user profile from our database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();
      
      if (userError || !userData) {
        console.error("User data error:", userError);
        // Fallback to mock for demo purposes
        return mockLogin(email, password);
      }
      
      // Store user in localStorage for compatibility
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData as User;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
  
  // Fallback to mock login for demo
  return mockLogin(email, password);
};

// Mock login for demo purposes
const mockLogin = (email: string, password: string): User | null => {
  console.log("Using mock login as fallback");
  const user = users.find(u => u.email === email);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

// Logout from Supabase and clear local storage
export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error during logout:", error);
  }
  
  localStorage.removeItem('currentUser');
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

// Check if user has a specific role - async version
export const hasRole = async (role: UserRole): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  if (role === 'user') return true;
  if (role === 'admin') return user.role === 'admin' || user.role === 'super_admin';
  if (role === 'super_admin') return user.role === 'super_admin';
  
  return false;
};

// Sync version for compatibility with existing code
export const hasRoleSync = (role: UserRole): boolean => {
  const user = getCurrentUserSync();
  if (!user) return false;
  
  if (role === 'user') return true;
  if (role === 'admin') return user.role === 'admin' || user.role === 'super_admin';
  if (role === 'super_admin') return user.role === 'super_admin';
  
  return false;
};
