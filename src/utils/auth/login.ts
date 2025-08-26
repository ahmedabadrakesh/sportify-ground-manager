
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";
import { handlePredefinedAdminLogin } from "./adminAuth";

// Login with Supabase - supports email or phone number login
export const login = async (identifier: string, password: string): Promise<User | null> => {
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
    
    console.log("Not a predefined admin, trying Supabase auth...");
    
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
      console.log("Supabase auth successful, fetching user profile for:", authData.user.id);
      
      // Fetch user profile from our database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();
      
      console.log("User profile fetch result:", { userData, userError });
      
      if (userError || !userData) {
        console.error("User data error:", userError);
        console.log("Creating user profile from auth data...");
        
        // Create user profile if it doesn't exist
        const newUserData = {
          auth_id: authData.user.id,
          name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'User',
          email: authData.user.email,
          phone: authData.user.phone || null,
          role: authData.user.user_metadata?.user_type || 'user',
        };
        
        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUserData])
          .select()
          .single();
          
        if (createError) {
          console.error("Failed to create user profile:", createError);
          return null;
        }
        
        console.log("User profile created:", createdUser);
        
        // Store user in localStorage for compatibility
        localStorage.setItem('currentUser', JSON.stringify(createdUser));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: createdUser, session: authData.session } 
        }));
        
        return createdUser as User;
      }
      
      console.log("User profile found:", userData);
      
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
