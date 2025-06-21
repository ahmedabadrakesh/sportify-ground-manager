
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";

// Track ongoing registration attempts to prevent duplicates
const ongoingRegistrations = new Map<string, Promise<User | null>>();

// Register a new user
export const register = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string, 
  userType: 'user' | 'sports_professional' = 'user'
): Promise<User | null> => {
  // Create a unique key for this registration attempt
  const registrationKey = email || phone;
  
  // Check if a registration is already in progress for this identifier
  if (ongoingRegistrations.has(registrationKey)) {
    console.log("Registration already in progress for:", registrationKey);
    // Return the existing promise instead of creating a new one
    return ongoingRegistrations.get(registrationKey)!;
  }

  console.log("Starting registration process for:", { name, email, phone, userType });
  
  // Create the registration promise
  const registrationPromise = performRegistration(name, email, phone, password, userType);
  
  // Store the promise to prevent duplicates
  ongoingRegistrations.set(registrationKey, registrationPromise);
  
  // Clean up when done (whether success or failure)
  registrationPromise.finally(() => {
    ongoingRegistrations.delete(registrationKey);
  });
  
  return registrationPromise;
};

// Actual registration implementation
const performRegistration = async (
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
        
        // If user registered as sports professional, create sports professional entry
        if (userType === 'sports_professional') {
          await createDefaultSportsProfessionalEntry(userData.id, name, email || formattedPhone);
        }
        
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
          
          // If user registered as sports professional, create sports professional entry
          if (userType === 'sports_professional') {
            await createDefaultSportsProfessionalEntry(manualUserData.id, name, email || formattedPhone);
          }
          
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
  }
};

// Helper function to create a default sports professional entry
const createDefaultSportsProfessionalEntry = async (
  userId: string,
  name: string,
  contactNumber: string
) => {
  try {
    console.log("Creating default sports professional entry for user:", userId);
    
    // Get the first available game for default assignment
    const { data: games } = await supabase
      .from('games')
      .select('id')
      .limit(1);
    
    if (!games || games.length === 0) {
      console.error("No games available to assign to sports professional");
      return;
    }
    
    const defaultProfessionalData = {
      user_id: userId,
      name: name,
      profession_type: 'Athlete' as const,
      game_id: games[0].id,
      contact_number: contactNumber,
      fee: 0,
      fee_type: 'Per Hour' as const,
      city: '',
      address: '',
      comments: null,
      photo: null,
      awards: [],
      accomplishments: [],
      certifications: [],
      training_locations: [],
      videos: [],
      images: [],
      punch_line: null,
      instagram_link: null,
      facebook_link: null,
      linkedin_link: null,
      website: null,
      level: null,
      coaching_availability: [],
    };
    
    const { error: professionalError } = await supabase
      .from('sports_professionals')
      .insert(defaultProfessionalData);
    
    if (professionalError) {
      console.error("Error creating sports professional entry:", professionalError);
    } else {
      console.log("Default sports professional entry created successfully");
    }
  } catch (error) {
    console.error("Error in createDefaultSportsProfessionalEntry:", error);
  }
};
