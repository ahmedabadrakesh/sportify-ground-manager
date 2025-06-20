
import { supabase } from "@/integrations/supabase/client";

// Logout from Supabase and clear local storage
export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error during logout:", error);
  }
  
  // Clear local storage
  localStorage.removeItem('currentUser');
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { user: null, session: null } 
  }));
};
