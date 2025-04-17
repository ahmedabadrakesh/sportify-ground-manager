import React, { useState, useEffect } from "react";
import { Boxes, BarChart3 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddItemForm from "@/components/inventory/AddItemForm";
import EditItemForm from "@/components/inventory/EditItemForm";
import { InventoryItem, GroundInventory, Ground } from "@/types/models";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { getAllInventoryItems } from "@/utils/inventory";
import { getGroundInventory } from "@/utils/inventory/inventory-ground";
import { supabase } from "@/integrations/supabase/client";

import InventoryHeader from "@/components/admin/inventory/InventoryHeader";
import InventoryItemsTab from "@/components/admin/inventory/InventoryItemsTab";
import GroundAllocationTab from "@/components/admin/inventory/GroundAllocationTab";
import DeleteItemDialog from "@/components/admin/inventory/DeleteItemDialog";

const AdminInventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [groundInventory, setGroundInventory] = useState<GroundInventory[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
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

  const handleEditItem = (itemId: string) => {
    const item = inventoryItems.find(item => item.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsEditItemOpen(true);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemToDelete);
      
      if (error) {
        throw error;
      }
      
      setInventoryItems(prevItems => 
        prevItems.filter(item => item.id !== itemToDelete)
      );
      
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <InventoryHeader onAddItem={() => setIsAddItemOpen(true)} />

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
            <InventoryItemsTab 
              inventoryItems={inventoryItems}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </TabsContent>
          
          <TabsContent value="allocation">
            <GroundAllocationTab 
              groundInventory={groundInventory}
              grounds={grounds}
              isSuperAdmin={isSuperAdmin}
            />
          </TabsContent>
        </Tabs>
      )}
      
      <AddItemForm 
        open={isAddItemOpen} 
        onOpenChange={setIsAddItemOpen}
        onItemAdded={handleItemAdded}
      />
      
      <EditItemForm
        open={isEditItemOpen}
        onOpenChange={setIsEditItemOpen}
        onItemUpdated={fetchData}
        item={selectedItem}
      />
      
      <DeleteItemDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteItem}
      />
    </AdminLayout>
  );
};

export default AdminInventory;
