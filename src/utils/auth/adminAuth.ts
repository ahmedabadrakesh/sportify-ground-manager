
import { User } from "@/types/models";

// Handle predefined admin login
export const handlePredefinedAdminLogin = (identifier: string, password: string): User | null => {
  console.log("Using predefined admin login");
  
  // Check credentials
  if (identifier === 'sa@123456' && password === '1234') {
    const superAdmin = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Super Admin',
      email: 'sa@123456',
      phone: '',
      role: 'super_admin' as User['role']
    };
    localStorage.setItem('currentUser', JSON.stringify(superAdmin));
    return superAdmin;
  } 
  else if (identifier === 'a@123456' && password === '1234') {
    const admin = {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Admin User',
      email: 'a@123456',
      phone: '',
      role: 'admin' as User['role']
    };
    localStorage.setItem('currentUser', JSON.stringify(admin));
    return admin;
  }else if (identifier === 'damini@jokova.com' && password === 'Damini@1234') {
    const admin = {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Admin User',
      email: 'damini@jokova.com',
      phone: '',
      role: 'admin' as User['role']
    };
    localStorage.setItem('currentUser', JSON.stringify(admin));
    return admin;
  }
  
  return null;
};
