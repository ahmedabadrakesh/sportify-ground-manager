
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";
import { users } from "@/data/mockData";
import { handlePredefinedAdminLogin } from './adminAuth';
import { mockLogin } from './mockAuth';

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

// Register a new user
export const register = async (name: string, email: string, phone: string, password: string): Promise<User | null> => {
  try {
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    let newUser: User;
    let registrationSuccess = false;
    
    // Try authentication with Supabase first
    if (email) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: 'user'
            }
          }
        });
        
        if (data.user && !error) {
          registrationSuccess = true;
          newUser = {
            id: data.user.id,
            name,
            email: email,
            phone: formattedPhone || '',
            role: 'user' as User['role'],
            authId: data.user.id
          };
          
          const { error: insertError } = await supabase
            .from('users')
            .insert(newUser);
          
          if (insertError) {
            console.error("Error inserting user profile:", insertError);
          }
        } else {
          console.error("Supabase email registration error:", error);
          // Will fallback to mock registration below
        }
      } catch (emailError) {
        console.error("Email registration error:", emailError);
        // Will fallback to mock registration below
      }
    } else if (phone) {
      try {
        const { data, error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password,
          options: {
            data: {
              name,
              role: 'user'
            }
          }
        });
        
        if (data.user && !error) {
          registrationSuccess = true;
          newUser = {
            id: data.user.id,
            name,
            email: email || '',
            phone: formattedPhone,
            role: 'user' as User['role'],
            authId: data.user.id
          };
          
          const { error: insertError } = await supabase
            .from('users')
            .insert(newUser);
          
          if (insertError) {
            console.error("Error inserting user profile:", insertError);
          }
        } else {
          console.error("Supabase phone registration error:", error);
          // Will fallback to mock registration below
        }
      } catch (phoneError) {
        console.error("Phone registration error:", phoneError);
        // Will fallback to mock registration below
      }
    }
    
    // If Supabase registration failed or there were errors, use mock registration for demo purposes
    if (!registrationSuccess) {
      console.log("Using mock registration for demo");
      
      // Generate a unique ID for the mock user
      const mockUserId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      newUser = {
        id: mockUserId,
        name,
        email: email || '',
        phone: formattedPhone || '',
        role: 'user' as User['role']
      };
      
      // Store in localStorage for demo persistence
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      mockUsers.push({
        ...newUser,
        password // Store password only for mock users
      });
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
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
  
  localStorage.removeItem('currentUser');
};
