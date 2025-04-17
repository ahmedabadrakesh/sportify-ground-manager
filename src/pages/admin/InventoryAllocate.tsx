
import React from "react";
import { Package, BarChart3 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryData } from "@/hooks/useInventoryData";
import { hasRole } from "@/utils/auth";
import GroundSelector from "@/components/admin/inventory/GroundSelector";
import CurrentGroundInventory from "@/components/admin/inventory/CurrentGroundInventory";
import AvailableInventoryTable from "@/components/admin/inventory/AvailableInventoryTable";
import AllocationForm from "@/components/admin/inventory/AllocationForm";

const InventoryAllocate: React.FC = () => {
  const {
    inventoryItems,
    groundInventory,
    grounds,
    loading,
    selectedGround,
    setSelectedGround,
    refreshData
  } = useInventoryData();
  
  // Check if the current user is a super admin
  if (!hasRole('super_admin')) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Allocate Inventory</h1>
        <p className="text-gray-600">
          Assign inventory items to specific grounds.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading inventory data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Ground Inventory</CardTitle>
                <CardDescription>
                  Select a ground to view and allocate inventory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GroundSelector 
                  grounds={grounds}
                  selectedGround={selectedGround}
                  setSelectedGround={setSelectedGround}
                />
                
                <CurrentGroundInventory
                  selectedGround={selectedGround}
                  groundInventory={groundInventory}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Inventory Items</CardTitle>
                <CardDescription>
                  All inventory items that can be allocated to grounds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AvailableInventoryTable inventoryItems={inventoryItems} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Allocate Inventory</CardTitle>
                <CardDescription>
                  Assign items to the selected ground.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AllocationForm
                  selectedGround={selectedGround}
                  inventoryItems={inventoryItems}
                  onAllocationComplete={refreshData}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default InventoryAllocate;
