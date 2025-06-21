
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

export interface PhoneUser {
  id: string;
  name: string;
  phone: string;
  user_type: 'user' | 'sports_professional';
  role: 'user' | 'sports_professional'; // Add role property for compatibility
  created_at: string;
  updated_at: string;
}

// Hash password for security
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Register a new user with phone number
export const registerWithPhone = async (
  name: string,
  phone: string,
  password: string,
  userType: 'user' | 'sports_professional' = 'user'
): Promise<PhoneUser | null> => {
  try {
    console.log("Starting phone registration for:", { name, phone, userType });
    
    // Format phone number
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Insert user into phone_registrations table
    const { data, error } = await supabase
      .from('phone_registrations')
      .insert({
        name,
        phone: formattedPhone,
        password: hashedPassword,
        user_type: userType
      })
      .select()
      .single();
    
    if (error) {
      console.error("Phone registration error:", error);
      
      // Handle unique constraint violation (phone already exists)
      if (error.code === '23505') {
        throw new Error("This phone number is already registered. Please try logging in or use a different number.");
      }
      
      throw error;
    }
    
    if (data) {
      console.log("Phone registration successful:", data);
      
      // Store user in localStorage with proper typing
      const user: PhoneUser = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        user_type: data.user_type as 'user' | 'sports_professional',
        role: data.user_type as 'user' | 'sports_professional', // Map user_type to role
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      localStorage.setItem('currentPhoneUser', JSON.stringify(user));
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('phoneAuthStateChanged', { 
        detail: { user } 
      }));
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Phone registration error:", error);
    throw error;
  }
};

// Login with phone number
export const loginWithPhone = async (phone: string, password: string): Promise<PhoneUser | null> => {
  try {
    console.log("Phone login attempt for:", phone);
    
    // Format phone number
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    // Fetch user by phone
    const { data, error } = await supabase
      .from('phone_registrations')
      .select('*')
      .eq('phone', formattedPhone)
      .single();
    
    if (error || !data) {
      console.error("User not found:", error);
      return null;
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, data.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return null;
    }
    
    console.log("Phone login successful:", data);
    
    // Store user in localStorage with proper typing
    const user: PhoneUser = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      user_type: data.user_type as 'user' | 'sports_professional',
      role: data.user_type as 'user' | 'sports_professional', // Map user_type to role
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    localStorage.setItem('currentPhoneUser', JSON.stringify(user));
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('phoneAuthStateChanged', { 
      detail: { user } 
    }));
    
    return user;
  } catch (error) {
    console.error("Phone login error:", error);
    return null;
  }
};

// Logout
export const logoutPhoneUser = (): void => {
  localStorage.removeItem('currentPhoneUser');
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('phoneAuthStateChanged', { 
    detail: { user: null } 
  }));
};

// Get current user
export const getCurrentPhoneUser = (): PhoneUser | null => {
  const userStr = localStorage.getItem('currentPhoneUser');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Ensure backward compatibility by adding role if it doesn't exist
      if (user && !user.role && user.user_type) {
        user.role = user.user_type;
      }
      return user;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem('currentPhoneUser');
    }
  }
  return null;
};
