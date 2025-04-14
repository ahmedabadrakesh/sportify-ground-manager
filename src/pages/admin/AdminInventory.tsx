
import React, { useState, useEffect } from "react";
import { PlusCircle, Boxes, BarChart3 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "@/components/inventory/InventoryTable";
import GroundInventoryTable from "@/components/inventory/GroundInventoryTable";
import { InventoryItem, GroundInventory, Ground } from "@/types/models";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";

const AdminInventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [groundInventory, setGroundInventory] = useState<GroundInventory[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  useEffect(() => {
    // Fetch inventory and ground data
    const fetchData = async () => {
      try {
        // Simulate API calls with timeouts
        setTimeout(async () => {
          const { inventoryItems: mockInventory, groundInventory: mockGroundInventory, grounds: mockGrounds } = await import("@/data/mockData");
          
          // Filter ground inventory based on user role
          let userGroundInventory = isSuperAdmin
            ? mockGroundInventory
            : mockGroundInventory.filter(item => {
                const ground = mockGrounds.find(g => g.id === item.groundId);
                return ground?.ownerId === currentUser?.id;
              });
          
          setInventoryItems(mockInventory);
          setGroundInventory(userGroundInventory);
          setGrounds(mockGrounds);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        toast.error("Failed to load inventory data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, isSuperAdmin]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">
            Manage your platform's inventory items and ground-specific allocations.
          </p>
        </div>
        
        <Button className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading inventory data...</p>
        </div>
      ) : (
        <Tabs defaultValue="items" className="space-y-4">
          <TabsList>
            <TabsTrigger value="items">
              <Boxes className="h-4 w-4 mr-2" />
              Items
            </TabsTrigger>
            <TabsTrigger value="allocation">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ground Allocation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
                <CardDescription>
                  Manage the items available across all grounds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryTable inventory={inventoryItems.map(item => ({
                  groundId: '',
                  itemId: item.id,
                  itemName: item.name,
                  itemPrice: item.price,
                  quantity: 0
                }))} 
                readonly={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="allocation">
            <Card>
              <CardHeader>
                <CardTitle>Ground Inventory Allocation</CardTitle>
                <CardDescription>
                  Allocate specific items to individual grounds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GroundInventoryTable 
                  groundInventory={groundInventory} 
                  grounds={grounds}
                  isSuperAdmin={isSuperAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
};

export default AdminInventory;
