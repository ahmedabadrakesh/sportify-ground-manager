
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUserSync } from "@/utils/auth";
import Sidebar from "./admin/Sidebar";
import MobileHeader from "./admin/MobileHeader";
import MobileBreadcrumb from "./admin/MobileBreadcrumb";
import { hasRoleSync } from "@/utils/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    navigate("/login");
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
