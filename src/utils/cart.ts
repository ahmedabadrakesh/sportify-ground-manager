
import { Product, CartItem } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper to get cart from localStorage
export const getCart = (): CartItem[] => {
  const cartItems = localStorage.getItem("cart");
  return cartItems ? JSON.parse(cartItems) : [];
};

// Add to cart
export const addToCart = (product: Product, quantity: number = 1): CartItem | null => {
  try {
    const cart = getCart();
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity
      const newCart = cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
      
      localStorage.setItem("cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cartUpdated"));
      return existingItem;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || undefined
      };
      
      const newCart = [...cart, newItem];
      localStorage.setItem("cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cartUpdated"));
      return newItem;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({ title: "Error", description: "Failed to add item to cart", variant: "destructive" });
    return null;
  }
};

// Get cart items
export const getCartItems = (): CartItem[] => {
  return getCart();
};

// Update cart item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): boolean => {
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) return false;
    
    cart[itemIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
  }
};

// Remove item from cart
export const removeFromCart = (productId: string): boolean => {
  try {
    const cart = getCart();
    const newCart = cart.filter(item => item.productId !== productId);
    
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

// Clear cart
export const clearCart = (): void => {
  localStorage.setItem("cart", JSON.stringify([]));
  window.dispatchEvent(new Event("cartUpdated"));
};

// Calculate cart total
export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get cart count
export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Get cart items count (alias for getCartCount for backward compatibility)
export const getCartItemsCount = (): number => {
  return getCartCount();
};

// Check if product is in cart
export const isInCart = (productId: string): boolean => {
  const cart = getCart();
  return cart.some(item => item.productId === productId);
};

// Process checkout
export const processCheckout = async (checkoutData: {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  totalAmount: number;
}): Promise<{ success: boolean; message: string; orderId?: string }> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        message: "Please log in to place an order."
      };
    }

    const orderNumber = `ORD-${Date.now()}`;
    
    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        customer_name: checkoutData.customer.name,
        customer_email: checkoutData.customer.email,
        customer_phone: checkoutData.customer.phone,
        shipping_address: checkoutData.customer.address,
        payment_method: checkoutData.paymentMethod,
        payment_status: checkoutData.paymentMethod === 'cod' ? 'pending' : 'paid',
        order_status: 'confirmed',
        total_amount: checkoutData.totalAmount
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return {
        success: false,
        message: "Failed to create order. Please try again."
      };
    }

    // Create order items
    const orderItems = checkoutData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Try to clean up the order if items creation failed
      await supabase.from('orders').delete().eq('id', order.id);
      return {
        success: false,
        message: "Failed to process order items. Please try again."
      };
    }
    
    // Clear cart after successful checkout
    clearCart();
    
    return {
      success: true,
      message: "Order placed successfully!",
      orderId: orderNumber
    };
  } catch (error) {
    console.error("Error processing checkout:", error);
    return {
      success: false,
      message: "Failed to process your order. Please try again."
    };
  }
};
