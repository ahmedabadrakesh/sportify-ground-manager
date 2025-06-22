
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
    
    console.log("Attempting Supabase auth signup...");
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fetch the created user profile
      console.log("Fetching user profile for auth_id:", data.user.id);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();
      
      let finalUser = userData;
      
      if (!userData || userError) {
        console.log("User profile not found, creating manually...", userError);
        // If the user profile wasn't created automatically, create it manually
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
          finalUser = manualUserData;
        } else {
          console.error("Manual user profile creation failed:", manualError);
          throw new Error("Failed to create user profile");
        }
      } else {
        console.log("User profile found:", userData);
      }
      
      // If user registered as sports professional, create sports professional entry
      if (userType === 'sports_professional' && finalUser) {
        console.log("Creating sports professional entry for user:", finalUser.id);
        await createSportsProfessionalEntry(finalUser.id, name, email || formattedPhone);
      }
      
      if (finalUser) {
        localStorage.setItem('currentUser', JSON.stringify(finalUser));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: finalUser, session: data.session } 
        }));
        
        return finalUser as User;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Helper function to create a sports professional entry
const createSportsProfessionalEntry = async (
  userId: string,
  name: string,
  contactNumber: string
) => {
  try {
    console.log("Creating sports professional entry for user:", userId);
    
    // Get the first available game for default assignment
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('id')
      .limit(1);
    
    if (gamesError) {
      console.error("Error fetching games:", gamesError);
      throw gamesError;
    }
    
    if (!games || games.length === 0) {
      console.error("No games available to assign to sports professional");
      throw new Error("No games available. Please contact administrator.");
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
    
    console.log("Inserting sports professional data:", defaultProfessionalData);
    
    const { data: professionalData, error: professionalError } = await supabase
      .from('sports_professionals')
      .insert(defaultProfessionalData)
      .select()
      .single();
    
    if (professionalError) {
      console.error("Error creating sports professional entry:", professionalError);
      throw professionalError;
    } else {
      console.log("Sports professional entry created successfully:", professionalData);
    }
  } catch (error) {
    console.error("Error in createSportsProfessionalEntry:", error);
    throw error;
  }
};
