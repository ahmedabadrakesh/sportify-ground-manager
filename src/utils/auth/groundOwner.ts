
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/models";

// Create ground owner user
export const createGroundOwner = async (name: string, email: string, phone: string): Promise<User | null> => {
  try {
    // Format phone number if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone.replace(/^0+/, '');
    }
    
    const defaultPassword = '123456';
    let newGroundOwner: User;
    let registrationSuccess = false;
    
    // Try to create with Supabase Auth
    if (email) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: defaultPassword,
          options: {
            data: {
              name,
              role: 'ground_owner'
            }
          }
        });
        
        if (data.user && !error) {
          registrationSuccess = true;
          const newGroundOwner: User = {
            id: data.user.id,
            name,
            email,
            role: 'ground_owner' as User['role'],
            authId: data.user.id
          };
          
          const { error: insertError } = await supabase
            .from('users')
            .insert(newGroundOwner);
          
          if (insertError) {
            console.error("Error creating ground owner profile:", insertError);
          }
        }
      } catch (emailError) {
        console.error("Ground owner email creation error:", emailError);
      }
    } else if (phone) {
      try {
        const { data, error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password: defaultPassword,
          options: {
            data: {
              name,
              role: 'ground_owner'
            }
          }
        });
        
        if (data.user && !error) {
          registrationSuccess = true;
          newGroundOwner = {
            id: data.user.id,
            name,
            email: '',
            role: 'ground_owner' as User['role'],
            authId: data.user.id
          };
          
          const { error: insertError } = await supabase
            .from('users')
            .insert(newGroundOwner);
          
          if (insertError) {
            console.error("Error creating ground owner profile:", insertError);
          }
        }
      } catch (phoneError) {
        console.error("Ground owner phone creation error:", phoneError);
      }
    }
    
    // If Supabase registration failed, use mock registration for demo
    if (!registrationSuccess) {
      console.log("Using mock ground owner creation");
      
      // Generate a unique ID for the mock ground owner
      const mockOwnerId = `mock_owner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      newGroundOwner = {
        id: mockOwnerId,
        name,
        email: email || '',
        role: 'ground_owner' as User['role']
      };
      
      // Store mock ground owner in localStorage for demo persistence
      const mockOwners = JSON.parse(localStorage.getItem('mockOwners') || '[]');
      mockOwners.push({
        ...newGroundOwner,
        password: defaultPassword
      });
      localStorage.setItem('mockOwners', JSON.stringify(mockOwners));
    }
    
    return newGroundOwner;
  } catch (error) {
    console.error("Ground owner creation error:", error);
    return null;
  }
};
