
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";

// Track ongoing registration attempts to prevent duplicates
const ongoingRegistrations = new Set<string>();

// Register a new user
export const register = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string, 
  userType: 'user' | 'sports_professional' = 'user'
): Promise<User | null> => {
  // Create a unique key for this registration attempt
  const registrationKey = `${email || phone}_${Date.now()}`;
  
  // Check if a similar registration is already in progress
  const existingKey = Array.from(ongoingRegistrations).find(key => 
    key.startsWith(email || phone)
  );
  
  if (existingKey) {
    console.log("Registration already in progress for this identifier");
    throw new Error("Registration already in progress. Please wait.");
  }

  ongoingRegistrations.add(registrationKey);

  try {
    console.log("Starting registration process for:", { name, email, phone, userType });
    
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
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
      
      // Handle rate limit errors specifically
      if (error.status === 429 || error.message?.includes("rate limit")) {
        throw new Error("Too many registration attempts. Please wait a few minutes before trying again.");
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
        // If the user profile wasn't created automatically, create it manually
        console.log("Attempting to create user profile manually...");
        
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
        } else {
          console.error("Manual user profile creation failed:", manualError);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  } finally {
    // Always clean up the registration tracking
    ongoingRegistrations.delete(registrationKey);
  }
};
