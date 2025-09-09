import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./admin/Sidebar";
import MobileHeader from "./admin/MobileHeader";
import MobileBreadcrumb from "./admin/MobileBreadcrumb";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        
        if (!storedUser) {
          console.log('AdminLayout: No stored user - redirecting to login');
          navigate('/login');
          return;
        }
        
        const user = JSON.parse(storedUser);
        console.log('AdminLayout: User role:', user.role);
        
        if (!['admin', 'super_admin'].includes(user.role)) {
          console.log('AdminLayout: User not admin - redirecting to home');
          navigate('/');
          return;
        }
        
        // For predefined admins, we don't need Supabase session validation
        // They are handled through localStorage only
        setIsValidated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('AdminLayout: Auth check error:', error);
        localStorage.removeItem('currentUser');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading || !isValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar 
        userName={currentUser.name} 
        userRole={currentUser.role} 
        isSuperAdmin={isSuperAdmin} 
      />
      
      {/* Mobile header */}
      <MobileHeader 
        userName={currentUser.name} 
        userRole={currentUser.role} 
        isSuperAdmin={isSuperAdmin} 
      />
      
      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile breadcrumbs */}
        <MobileBreadcrumb pathname={location.pathname} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
