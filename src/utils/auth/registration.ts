
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
  
  console.log("=== REGISTRATION START ===");
  console.log("Registration parameters:", { name, email, phone, userType, registrationKey });
  
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
    console.log("Cleaning up registration promise for:", registrationKey);
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
    console.log("=== PERFORM REGISTRATION START ===");
    console.log("Input validation:", { 
      name: !!name, 
      email: !!email, 
      phone: !!phone, 
      password: !!password, 
      userType 
    });
    
    // Validate inputs
    if (!name || !password) {
      throw new Error("Name and password are required");
    }
    
    if (!email && !phone) {
      throw new Error("Either email or phone number is required");
    }
    
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
      console.log("Formatted phone:", formattedPhone);
    }
    
    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
    }
    
    console.log("Attempting Supabase auth signup...");
    const signUpData = {
      email: email || `${phone}@phone.user`,
      password,
      options: {
        data: {
          name,
          user_type: userType
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    };
    console.log("SignUp data:", signUpData);
    
    const { data, error } = await supabase.auth.signUp(signUpData);
    
    if (error) {
      console.error("Supabase auth signup error:", error);
      
      // Handle rate limit errors specifically
      if (error.status === 429 || error.message?.includes("rate limit")) {
        throw new Error("Too many registration attempts. Please wait a few minutes before trying again.");
      }
      
      throw error;
    }
    
    console.log("Supabase auth registration successful:", data);
    
    if (data.user) {
      console.log("User created with ID:", data.user.id);
      
      // Wait a moment for the trigger to execute
      console.log("Waiting for user profile creation...");
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
        const userRole = userType === 'sports_professional' ? 'sports_professional' : 'user';
        const manualUserData = {
          auth_id: data.user.id,
          name,
          email: email || `${formattedPhone}@phone.user`,
          phone: formattedPhone || null,
          role: userRole as 'user' | 'sports_professional' | 'admin' | 'super_admin' | 'ground_owner'
        };
        console.log("Creating manual user profile:", manualUserData);
        
        const { data: manualUserResult, error: manualError } = await supabase
          .from('users')
          .insert(manualUserData)
          .select()
          .single();
        
        if (manualUserResult && !manualError) {
          console.log("Manual user profile creation successful:", manualUserResult);
          finalUser = manualUserResult;
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
        console.log("Storing user in localStorage:", finalUser);
        localStorage.setItem('currentUser', JSON.stringify(finalUser));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: finalUser, session: data.session } 
        }));
        
        console.log("=== REGISTRATION SUCCESS ===");
        return finalUser as User;
      }
    }
    
    console.log("=== REGISTRATION FAILED - NO USER ===");
    return null;
  } catch (error) {
    console.error("=== REGISTRATION ERROR ===", error);
    throw error;
  }
};

// Helper function to verify user exists before creating sports professional entry
const verifyUserExists = async (userId: string, maxRetries: number = 3): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Verifying user exists, attempt ${attempt}/${maxRetries}:`, userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (data && !error) {
      console.log("User verification successful:", userId);
      return true;
    }
    
    if (attempt < maxRetries) {
      console.log(`User not found yet, waiting before retry ${attempt + 1}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.error("User verification failed after all retries:", userId);
  return false;
};

// Helper function to create a sports professional entry
const createSportsProfessionalEntry = async (
  userId: string,
  name: string,
  contactNumber: string
) => {
  try {
    console.log("=== CREATING SPORTS PROFESSIONAL ENTRY ===");
    console.log("Creating sports professional entry for user:", userId);
    
    // First, verify that the user exists in the database
    const userExists = await verifyUserExists(userId);
    if (!userExists) {
      throw new Error("User record not found in database. Cannot create sports professional entry.");
    }
    
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
