
import React, { useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import GroundsTable from "@/components/grounds/GroundsTable";
import GroundsHeader from "@/components/admin/grounds/GroundsHeader";
import GroundsLoading from "@/components/admin/grounds/GroundsLoading";
import { useGroundsData } from "@/hooks/useGroundsData";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminGrounds: React.FC = () => {
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // For demo purposes, show a toast instead of redirecting
        console.warn("No active Supabase session found. Using local auth.");
      }
    };
    
    checkAuth();
  }, []);
  
  const { grounds, loading, deleteGround } = useGroundsData({
    isSuperAdmin,
    currentUserId: currentUser?.id
  });

  return (
    <AdminLayout>
      <GroundsHeader isSuperAdmin={isSuperAdmin} />

      {loading ? (
        <GroundsLoading />
      ) : (
        <GroundsTable 
          grounds={grounds}
          isSuperAdmin={isSuperAdmin}
          onDeleteGround={deleteGround}
        />
      )}
    </AdminLayout>
  );
};

export default AdminGrounds;
