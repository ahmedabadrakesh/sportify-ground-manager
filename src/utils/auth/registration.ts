
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";
import { registerWithPhone, PhoneUser } from "./phoneRegistration";

// Track ongoing registration attempts to prevent duplicates
const ongoingRegistrations = new Map<string, Promise<User | PhoneUser | null>>();

// Register a new user - now supports both Supabase Auth and direct phone registration
export const register = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string, 
  userType: 'user' | 'sports_professional' = 'user'
): Promise<User | PhoneUser | null> => {
  // Create a unique key for this registration attempt
  const registrationKey = email || phone;
  
  // Check if a registration is already in progress for this identifier
  if (ongoingRegistrations.has(registrationKey)) {
    console.log("Registration already in progress for:", registrationKey);
    return ongoingRegistrations.get(registrationKey)!;
  }

  console.log("Starting registration process for:", { name, email, phone, userType });
  
  // Determine registration method
  let registrationPromise: Promise<User | PhoneUser | null>;
  
  if (!email && phone) {
    // Phone-only registration using direct database approach
    console.log("Using phone-only registration method");
    registrationPromise = registerWithPhone(name, phone, password, userType);
  } else {
    // Email registration using Supabase Auth (fallback)
    console.log("Using email registration method");
    registrationPromise = performEmailRegistration(name, email, phone, password, userType);
  }
  
  // Store the promise to prevent duplicates
  ongoingRegistrations.set(registrationKey, registrationPromise);
  
  // Clean up when done (whether success or failure)
  registrationPromise.finally(() => {
    ongoingRegistrations.delete(registrationKey);
  });
  
  return registrationPromise;
};

// Email registration implementation (existing Supabase Auth method)
const performEmailRegistration = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string, 
  userType: 'user' | 'sports_professional'
): Promise<User | null> => {
  try {
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    if (!email) {
      throw new Error("Email is required for Supabase Auth registration");
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_type: userType,
          phone: formattedPhone
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error("Email registration error:", error);
      
      // Handle rate limit errors specifically
      if (error.status === 429 || error.message?.includes("rate limit")) {
        throw new Error("Too many registration attempts. Please wait a few minutes before trying again.");
      }
      
      // Handle email already registered
      if (error.message?.includes("User already registered")) {
        throw new Error("This email is already registered. Please try logging in or use a different email.");
      }
      
      throw error;
    }
    
    console.log("Supabase auth registration successful:", data);
    
    if (data.user) {
      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fetch the created user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();
      
      if (userData && !userError) {
        console.log("User profile created successfully:", userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: userData, session: data.session } 
        }));
        
        return userData as User;
      } else {
        console.error("Error fetching user profile:", userError);
        // Create user profile manually if needed
        const { data: manualUserData, error: manualError } = await supabase
          .from('users')
          .insert({
            auth_id: data.user.id,
            name,
            email,
            phone: formattedPhone || null,
            role: userType === 'sports_professional' ? 'sports_professional' : 'user'
          })
          .select()
          .single();
        
        if (manualUserData && !manualError) {
          console.log("Manual user profile creation successful:", manualUserData);
          localStorage.setItem('currentUser', JSON.stringify(manualUserData));
          
          // Trigger a custom event to notify other components
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { user: manualUserData, session: data.session } 
          }));
          
          return manualUserData as User;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Email registration error:", error);
    throw error;
  }
};
