
import React, { useState, useEffect } from "react";
import { PlusCircle, Boxes, BarChart3 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "@/components/inventory/InventoryTable";
import GroundInventoryTable from "@/components/inventory/GroundInventoryTable";
import AddItemForm from "@/components/inventory/AddItemForm";
import { InventoryItem, GroundInventory, Ground } from "@/types/models";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { getAllInventoryItems, getGroundInventory } from "@/utils/inventory";
import { supabase } from "@/integrations/supabase/client";

const AdminInventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [groundInventory, setGroundInventory] = useState<GroundInventory[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch inventory items from database
      const items = await getAllInventoryItems();
      setInventoryItems(items);

      // Fetch grounds data
      const { data: groundsData, error: groundsError } = await supabase
        .from('grounds')
        .select('*');
      
      if (groundsError) {
        console.error("Error fetching grounds:", groundsError);
        toast.error("Failed to load grounds data");
        return;
      }

      const fetchedGrounds = groundsData.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description || "",
        address: g.address,
        location: g.location as { lat: number; lng: number },
        ownerId: g.owner_id,
        ownerName: "", // Would be fetched in a real app
        ownerContact: "",
        ownerWhatsapp: "",
        games: g.games || [],
        facilities: g.facilities || [],
        images: g.images || [],
        rating: g.rating,
        reviewCount: g.review_count
      }));
      
      setGrounds(fetchedGrounds);
      
      // Fetch ground inventory for all grounds if superadmin, 
      // otherwise only for grounds owned by current user
      let allGroundInventory: GroundInventory[] = [];
      
      if (isSuperAdmin && fetchedGrounds.length > 0) {
        // Limit the number of parallel requests to avoid performance issues
        const groundInventoryPromises = fetchedGrounds.slice(0, 5).map(ground => 
          getGroundInventory(ground.id)
        );
        
        const groundInventoryResults = await Promise.all(groundInventoryPromises);
        allGroundInventory = groundInventoryResults.flat();
      } else if (currentUser && fetchedGrounds.length > 0) {
        const userGrounds = fetchedGrounds.filter(g => g.ownerId === currentUser.id);
        
        if (userGrounds.length > 0) {
          const groundInventoryPromises = userGrounds.slice(0, 5).map(ground => 
            getGroundInventory(ground.id)
          );
          
          const groundInventoryResults = await Promise.all(groundInventoryPromises);
          allGroundInventory = groundInventoryResults.flat();
        }
      }
      
      setGroundInventory(allGroundInventory);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // Only re-run this effect when these specific dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemAdded = () => {
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">
            Manage your platform's inventory items and ground-specific allocations.
          </p>
        </div>
        
        <Button className="flex items-center" onClick={() => setIsAddItemOpen(true)}>
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
      
      <AddItemForm 
        open={isAddItemOpen} 
        onOpenChange={setIsAddItemOpen}
        onItemAdded={handleItemAdded}
      />
    </AdminLayout>
  );
};

export default AdminInventory;
