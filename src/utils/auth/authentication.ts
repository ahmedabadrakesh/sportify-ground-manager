
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";

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
    
    if (authError) {
      console.error("Auth error:", authError);
      return null;
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
        return null;
      }
      
      // Store user in localStorage for compatibility
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { user: userData, session: authData.session } 
      }));
      
      return userData as User;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
  
  return null;
};

// Register a new user
export const register = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string, 
  userType: 'user' | 'sports_professional' = 'user'
): Promise<User | null> => {
  try {
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_type: userType
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      return null;
    }
    
    if (data.user) {
      // The trigger will automatically create the user profile
      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch the created user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();
      
      if (userData && !userError) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: userData, session: data.session } 
        }));
        
        return userData as User;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
};

// Logout from Supabase and clear local storage
export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error during logout:", error);
  }
  
  // Clear local storage
  localStorage.removeItem('currentUser');
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { user: null, session: null } 
  }));
};
