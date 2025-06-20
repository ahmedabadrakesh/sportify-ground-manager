
import { User } from "@/types/models";

// Mock authentication helper for handling rate limit fallbacks
export const createMockUser = (
  name: string,
  email: string,
  phone: string,
  userType: 'user' | 'sports_professional' = 'user'
): User => {
  const mockUserId = `mock_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id: mockUserId,
    name,
    email: email || '',
    phone: phone || '',
    role: userType === 'sports_professional' ? 'sports_professional' : 'user',
    whatsapp: phone || ''
  };
};

export const getMockUsers = (): Array<User & { password: string }> => {
  return JSON.parse(localStorage.getItem('mockUsers') || '[]');
};

export const authenticateMockUser = (email: string, password: string): User | null => {
  const mockUsers = getMockUsers();
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};
