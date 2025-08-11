import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/models";

// Get pending cart items from database
export const getPendingCartItems = async (): Promise<CartItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_items (
          product_id,
          product_name,
          quantity,
          unit_price
        )
      `)
      .eq('user_id', user.id)
      .eq('order_status', 'pending')
      .maybeSingle();

    if (orderError || !order) return [];

    const cartItems: CartItem[] = order.order_items.map((item: any) => ({
      id: `cart-${Date.now()}-${item.product_id}`,
      productId: item.product_id,
      name: item.product_name,
      price: item.unit_price,
      quantity: item.quantity,
      image: undefined
    }));

    return cartItems;
  } catch (error) {
    console.error("Error getting pending cart:", error);
    return [];
  }
};

// Load pending cart into localStorage
export const loadPendingCartToLocal = async (): Promise<boolean> => {
  try {
    const pendingItems = await getPendingCartItems();
    if (pendingItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(pendingItems));
      window.dispatchEvent(new Event("cartUpdated"));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error loading pending cart:", error);
    return false;
  }
};