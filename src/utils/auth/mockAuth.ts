
import { User } from "@/types/models";
import { users } from "@/data/mockData";

// Mock login for demo purposes
export const mockLogin = (identifier: string, password: string): User | null => {
  console.log("Using mock login as fallback");
  
  // First try to find user by email
  let user = users.find(u => u.email === identifier);
  
  // If not found, try by phone
  if (!user) {
    user = users.find(u => u.phone === identifier);
  }
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};
