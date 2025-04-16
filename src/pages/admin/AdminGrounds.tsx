
import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import GroundsTable from "@/components/grounds/GroundsTable";
import GroundsHeader from "@/components/admin/grounds/GroundsHeader";
import GroundsLoading from "@/components/admin/grounds/GroundsLoading";
import { useGroundsData } from "@/hooks/useGroundsData";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

const AdminGrounds: React.FC = () => {
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
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
