
import { Product, CartItem } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper to get cart from localStorage
export const getCart = (): CartItem[] => {
  const cartItems = localStorage.getItem("cart");
  return cartItems ? JSON.parse(cartItems) : [];
};

// Create or update pending cart in database
export const createPendingCart = async (items: CartItem[]): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const orderNumber = `PENDING-${Date.now()}`;
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Check for existing pending order
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('order_status', 'pending')
      .maybeSingle();

    let orderId: string;

    if (existingOrder) {
      // Update existing pending order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({
          total_amount: totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingOrder.id)
        .select()
        .single();

      if (orderError) throw orderError;
      orderId = order.id;

      // Delete existing order items
      await supabase.from('order_items').delete().eq('order_id', orderId);
    } else {
      // Create new pending order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          shipping_address: '',
          payment_method: '',
          payment_status: 'pending',
          order_status: 'pending',
          total_amount: totalAmount
        })
        .select()
        .single();

      if (orderError) throw orderError;
      orderId = order.id;
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderId;
  } catch (error) {
    console.error("Error creating pending cart:", error);
    return null;
  }
};

// Add to cart
export const addToCart = async (product: Product, quantity: number = 1): Promise<CartItem | null> => {
  try {
    const cart = getCart();
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === product.id);
    
    let newCart: CartItem[];
    if (existingItem) {
      // Update quantity
      newCart = cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
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
      
      newCart = [...cart, newItem];
    }
    
    localStorage.setItem("cart", JSON.stringify(newCart));
    
    // Create/update pending cart in database
    await createPendingCart(newCart);
    
    window.dispatchEvent(new Event("cartUpdated"));
    return existingItem || newCart[newCart.length - 1];
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
export const updateCartItemQuantity = async (productId: string, quantity: number): Promise<boolean> => {
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) return false;
    
    cart[itemIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update pending cart in database
    await createPendingCart(cart);
    
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: string): Promise<boolean> => {
  try {
    const cart = getCart();
    const newCart = cart.filter(item => item.productId !== productId);
    
    localStorage.setItem("cart", JSON.stringify(newCart));
    
    // Update pending cart in database
    if (newCart.length > 0) {
      await createPendingCart(newCart);
    } else {
      // Clear pending cart if no items left
      await clearPendingCart();
    }
    
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

// Clear pending cart from database
export const clearPendingCart = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('orders')
      .delete()
      .eq('user_id', user.id)
      .eq('order_status', 'pending');
  } catch (error) {
    console.error("Error clearing pending cart:", error);
  }
};

// Clear cart
export const clearCart = async (): Promise<void> => {
  localStorage.setItem("cart", JSON.stringify([]));
  await clearPendingCart();
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
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
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

    // Verify Razorpay payment if it's a card payment
    if (checkoutData.paymentMethod === 'card' && checkoutData.razorpayPaymentId) {
      const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpayOrderId: checkoutData.razorpayOrderId,
          razorpayPaymentId: checkoutData.razorpayPaymentId,
          razorpaySignature: checkoutData.razorpaySignature,
        }
      });

      if (verificationError || !verificationResult?.success) {
        return {
          success: false,
          message: "Payment verification failed. Please try again."
        };
      }
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
    await clearCart();
    
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
