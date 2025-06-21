
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";
import { handlePredefinedAdminLogin } from "./adminAuth";
import { loginWithPhone, PhoneUser } from "./phoneRegistration";

// Login with Supabase - supports email, phone number login, or direct phone login
export const login = async (identifier: string, password: string): Promise<User | PhoneUser | null> => {
  try {
    console.log("Login attempt for:", identifier);
    
    // First, check if this is a predefined admin account
    const adminUser = handlePredefinedAdminLogin(identifier, password);
    if (adminUser) {
      console.log("Predefined admin login successful:", adminUser);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { user: adminUser, session: null } 
      }));
      
      return adminUser;
    }
    
    // Determine if the identifier is an email or phone number
    const isEmail = identifier.includes('@');
    
    if (!isEmail) {
      // Try phone login first (direct database approach)
      console.log("Attempting phone login...");
      const phoneUser = await loginWithPhone(identifier, password);
      if (phoneUser) {
        return phoneUser;
      }
      
      console.log("Phone login failed, trying Supabase auth with phone...");
    }
    
    console.log("Trying Supabase auth...");
    
    let authData;
    let authError;
    
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
