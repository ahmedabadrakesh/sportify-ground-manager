import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getCurrentUserSync } from "@/utils/auth";
import { Plus } from "lucide-react";

const directSellSchema = z.object({
  itemId: z.string().min(1, "Please select an item"),
  groundId: z.string().min(1, "Please select a ground"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
  paymentStatus: z.string().min(1, "Please select payment status"),
  paymentMode: z.string().min(1, "Please select payment mode"),
});

type DirectSellFormData = z.infer<typeof directSellSchema>;

interface DirectSaleItem {
  id: string;
  itemName: string;
  groundName: string;
  ownerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  availableQuantity: number;
  price: number;
}

interface Ground {
  id: string;
  name: string;
  ownerId: string;
  ownerName?: string;
}

const DirectSell = () => {
  const [directSales, setDirectSales] = useState<DirectSaleItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalRemainingQuantity, setTotalRemainingQuantity] = useState(0);
  
  const currentUser = getCurrentUserSync();

  const form = useForm<DirectSellFormData>({
    resolver: zodResolver(directSellSchema),
    defaultValues: {
      itemId: "",
      groundId: "",
      quantity: 1,
      unitPrice: 0,
      paymentStatus: "",
      paymentMode: "",
    },
  });

  const selectedItemId = form.watch("itemId");
  const selectedItem = inventoryItems.find(item => item.id === selectedItemId);

  useEffect(() => {
    if (selectedItem) {
      form.setValue("unitPrice", selectedItem.price);
    }
  }, [selectedItem, form]);

  const fetchDirectSales = async () => {
    try {
      const { data, error } = await supabase
        .from("direct_sales")
        .select(`
          id,
          quantity,
          unit_price,
          total_price,
          created_at,
          inventory_items(name),
          grounds(name, owner_id),
          users(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedSales = data?.map((sale: any) => ({
        id: sale.id,
        itemName: sale.inventory_items?.name || "Unknown Item",
        groundName: sale.grounds?.name || "Unknown Ground",
        ownerName: sale.users?.name || "Unknown Owner",
        quantity: sale.quantity,
        unitPrice: sale.unit_price,
        totalPrice: sale.total_price,
        createdAt: new Date(sale.created_at).toLocaleDateString(),
      })) || [];

      setDirectSales(formattedSales);
    } catch (error) {
      console.error("Error fetching direct sales:", error);
      toast.error("Failed to fetch direct sales");
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("id, name, price, purchase_quantity")
        .is("deleted_at", null);

      if (error) throw error;

      // Calculate available quantity by subtracting allocated quantities
      const itemsWithAvailableQty = await Promise.all(
        (data || []).map(async (item) => {
          const { data: groundInventory } = await supabase
            .from("ground_inventory")
            .select("quantity")
            .eq("item_id", item.id);

          const allocatedQuantity = groundInventory?.reduce((sum, gi) => sum + gi.quantity, 0) || 0;
          const availableQuantity = (item.purchase_quantity || 0) - allocatedQuantity;

          return {
            id: item.id,
            name: item.name,
            availableQuantity: Math.max(0, availableQuantity),
            price: item.price,
          };
        })
      );

      setInventoryItems(itemsWithAvailableQty);
      setTotalRemainingQuantity(itemsWithAvailableQty.reduce((sum, item) => sum + item.availableQuantity, 0));
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast.error("Failed to fetch inventory items");
    }
  };

  const fetchGrounds = async () => {
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select(`
          id,
          name,
          owner_id,
          users(name)
        `)
        .is("deleted_at", null);

      if (error) throw error;

      const formattedGrounds = data?.map((ground: any) => ({
        id: ground.id,
        name: ground.name,
        ownerId: ground.owner_id,
        ownerName: ground.users?.name || "Unknown Owner",
      })) || [];

      setGrounds(formattedGrounds);
    } catch (error) {
      console.error("Error fetching grounds:", error);
      toast.error("Failed to fetch grounds");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDirectSales(),
        fetchInventoryItems(),
        fetchGrounds(),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const onSubmit = async (data: DirectSellFormData) => {
    try {
      if (!currentUser) {
        toast.error("User not authenticated");
        return;
      }

      const selectedGround = grounds.find(g => g.id === data.groundId);
      if (!selectedGround) {
        toast.error("Selected ground not found");
        return;
      }

      // Create order first
      console.log("Creating order with data:", {
        user_id: null, // Set to null since currentUser.id might not match auth.users
        customer_name: selectedGround.ownerName || "Direct Sale",
        customer_email: "direct@sale.com",
        customer_phone: "0000000000",
        shipping_address: "Direct Sale",
        payment_method: data.paymentMode,
        payment_status: data.paymentStatus,
        order_status: data.paymentStatus === "completed" ? "completed" : "confirmed",
        total_amount: data.quantity * data.unitPrice,
        order_number: `DS-${Date.now()}`,
        direct_sell: true,
      });

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: null, // Set to null to avoid foreign key constraint issues
          customer_name: selectedGround.ownerName || "Direct Sale",
          customer_email: "direct@sale.com",
          customer_phone: "0000000000",
          shipping_address: "Direct Sale",
          payment_method: data.paymentMode,
          payment_status: data.paymentStatus,
          order_status: data.paymentStatus === "completed" ? "completed" : "confirmed",
          total_amount: data.quantity * data.unitPrice,
          order_number: `DS-${Date.now()}`,
          direct_sell: true,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create direct sale record
      const { error: directSaleError } = await supabase
        .from("direct_sales")
        .insert({
          order_id: order.id,
          item_id: data.itemId,
          ground_id: data.groundId,
          quantity: data.quantity,
          unit_price: data.unitPrice,
          total_price: data.quantity * data.unitPrice,
          sold_by: currentUser.id,
        });

      if (directSaleError) throw directSaleError;

      // Update ground inventory
      const { data: existingInventory } = await supabase
        .from("ground_inventory")
        .select("quantity")
        .eq("ground_id", data.groundId)
        .eq("item_id", data.itemId)
        .single();

      if (existingInventory) {
        await supabase
          .from("ground_inventory")
          .update({ quantity: existingInventory.quantity + data.quantity })
          .eq("ground_id", data.groundId)
          .eq("item_id", data.itemId);
      } else {
        await supabase
          .from("ground_inventory")
          .insert({
            ground_id: data.groundId,
            item_id: data.itemId,
            quantity: data.quantity,
          });
      }

      toast.success("Direct sale completed successfully");
      setDialogOpen(false);
      form.reset();
      await Promise.all([fetchDirectSales(), fetchInventoryItems()]);
    } catch (error) {
      console.error("Error processing direct sale:", error);
      toast.error("Failed to process direct sale");
    }
  };

  const columns = [
    {
      accessorKey: "itemName",
      header: "Item Name",
    },
    {
      accessorKey: "groundName",
      header: "Ground Name",
    },
    {
      accessorKey: "ownerName",
      header: "Ground Owner",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }: any) => `₹${row.getValue("unitPrice")}`,
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }: any) => `₹${row.getValue("totalPrice")}`,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Direct Sell</h1>
            <p className="text-muted-foreground">
              Manage direct sales to ground owners
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Direct Sell
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Direct Sale</DialogTitle>
                <DialogDescription>
                  Sell inventory items directly to ground owners
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="itemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inventoryItems
                              .filter(item => item.availableQuantity > 0)
                              .map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} (Available: {item.availableQuantity})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groundId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ground</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a ground" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grounds.map((ground) => (
                              <SelectItem key={ground.id} value={ground.id}>
                                {ground.name} - {ground.ownerName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max={selectedItem?.availableQuantity || 1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        {selectedItem && (
                          <p className="text-sm text-muted-foreground">
                            Max available: {selectedItem.availableQuantity}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="cod">COD</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Complete Sale</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Direct Sales History</CardTitle>
            <CardDescription>
              All direct sales made to ground owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={directSales} />
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Remaining Inventory:</span>
                <span className="text-lg font-bold">{totalRemainingQuantity} items</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DirectSell;