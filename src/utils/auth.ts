
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/models";
import { users } from "@/data/mockData";

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
        role: 'user' as UserRole
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

// Login with Supabase - supports email or phone number login
export const login = async (identifier: string, password: string): Promise<User | null> => {
  try {
    let authData;
    let authError;
    
    // Determine if the identifier is an email or phone number
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      // Login with email
      const result = await supabase.auth.signInWithPassword({
        email: identifier,
        password
      });
      authData = result.data;
      authError = result.error;
    } else {
      // Login with phone number (ensure it's in the correct format with country code)
      let phoneNumber = identifier;
      if (!phoneNumber.startsWith('+')) {
        // If no country code, default to +91 (India)
        phoneNumber = '+91' + phoneNumber.replace(/^0+/, '');
      }
      
      const result = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password
      });
      authData = result.data;
      authError = result.error;
    }
    
    // Special case for predefined admin users
    if (authError && (identifier === 'sa@123456' || identifier === 'a@123456')) {
      return handlePredefinedAdminLogin(identifier, password);
    }
    
    if (authError) {
      console.error("Auth error:", authError);
      // Fallback to mock for demo purposes
      return mockLogin(identifier, password);
    }
    
    if (authData?.user) {
      // Fetch user profile from our database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();
      
      if (userError || !userData) {
        console.error("User data error:", userError);
        // Fallback to mock for demo purposes
        return mockLogin(identifier, password);
      }
      
      // Store user in localStorage for compatibility
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData as User;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
  
  // Fallback to mock login for demo
  return mockLogin(identifier, password);
};

// Handle predefined admin login
const handlePredefinedAdminLogin = (identifier: string, password: string): User | null => {
  console.log("Using predefined admin login");
  
  // Check credentials
  if (identifier === 'sa@123456' && password === '1234') {
    const superAdmin = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Super Admin',
      email: 'sa@123456',
      phone: '',
      role: 'super_admin' as UserRole
    };
    localStorage.setItem('currentUser', JSON.stringify(superAdmin));
    return superAdmin;
  } 
  else if (identifier === 'a@123456' && password === '1234') {
    const admin = {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Admin User',
      email: 'a@123456',
      phone: '',
      role: 'admin' as UserRole
    };
    localStorage.setItem('currentUser', JSON.stringify(admin));
    return admin;
  }
  
  return null;
};

// Mock login for demo purposes
const mockLogin = (identifier: string, password: string): User | null => {
  console.log("Using mock login as fallback");
  
  // First try to find user by email
  let user = users.find(u => u.email === identifier);
  
  // If not found, try by phone
  if (!user) {
    user = users.find(u => u.phone === identifier);
  }
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

// Register a new user
export const register = async (name: string, email: string, phone: string, password: string): Promise<User | null> => {
  try {
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    const identifierType = email ? { email } : { phone: formattedPhone };
    
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      ...identifierType,
      password,
      options: {
        data: {
          name,
          role: 'user' // All new registrations are normal users
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      return null;
    }
    
    if (data?.user) {
      // Create user entry in our users table
      const newUser = {
        id: data.user.id,
        name,
        email: email || '',
        phone: formattedPhone || '',
        role: 'user' as UserRole,
        auth_id: data.user.id
      };
      
      const { error: insertError } = await supabase
        .from('users')
        .insert(newUser);
      
      if (insertError) {
        console.error("Error creating user profile:", insertError);
      }
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    }
  } catch (error) {
    console.error("Registration error:", error);
  }
  
  return null;
};

// Create ground owner user
export const createGroundOwner = async (name: string, email: string, phone: string): Promise<User | null> => {
  try {
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    const defaultPassword = '123456';
    const identifierType = email ? { email } : { phone: formattedPhone };
    
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      ...identifierType,
      password: defaultPassword,
      options: {
        data: {
          name,
          role: 'ground_owner'
        }
      }
    });
    
    if (error) {
      console.error("Ground owner creation error:", error);
      
      // If user already exists, just create the profile with ground_owner role
      const existingUser = {
        name,
        email: email || '',
        phone: formattedPhone || '',
        role: 'ground_owner' as UserRole,
        whatsapp: formattedPhone || ''
      };
      
      return existingUser;
    }
    
    if (data?.user) {
      // Create user entry in our users table
      const newUser = {
        id: data.user.id,
        name,
        email: email || '',
        phone: formattedPhone || '',
        role: 'ground_owner' as UserRole,
        auth_id: data.user.id,
        whatsapp: formattedPhone || ''
      };
      
      const { error: insertError } = await supabase
        .from('users')
        .insert(newUser);
      
      if (insertError) {
        console.error("Error creating ground owner profile:", insertError);
      }
      
      return newUser;
    }
  } catch (error) {
    console.error("Ground owner creation error:", error);
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
  if (role === 'ground_owner') return user.role === 'ground_owner';
  
  return false;
};

// Sync version for compatibility with existing code
export const hasRoleSync = (role: UserRole): boolean => {
  const user = getCurrentUserSync();
  if (!user) return false;
  
  if (role === 'user') return true;
  if (role === 'admin') return user.role === 'admin' || user.role === 'super_admin';
  if (role === 'super_admin') return user.role === 'super_admin';
  if (role === 'ground_owner') return user.role === 'ground_owner';
  
  return false;
};
