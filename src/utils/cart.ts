import { supabase } from "@/integrations/supabase/client";
import { CartItem, Product } from "@/types/models";

// Get cart from database for authenticated users, localStorage for guest users
const getCart = async (): Promise<CartItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Authenticated user - get from database
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        color: item.product_color,
        image: undefined // Will be populated when needed
      }));
    } else {
      // Guest user - get from localStorage
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    }
  } catch (error) {
    console.error("Error getting cart:", error);
    // Fallback to localStorage
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
};

// Sync cart to database for authenticated users
const syncCartToDatabase = async (items: CartItem[]): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Clear existing cart items for this user
    await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);

    // Insert new cart items
    if (items.length > 0) {
      const cartItems = items.map(item => ({
        user_id: user.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        product_color: item.color
      }));

      const { error } = await supabase
        .from('cart')
        .insert(cartItems);

      if (error) {
        console.error("Error syncing cart to database:", error);
      }
    }
  } catch (error) {
    console.error("Error syncing cart:", error);
  }
};

// Create or update pending cart in database (legacy orders functionality)
const createPendingCart = async (items: CartItem[]): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if there's already a pending order
    const { data: existingOrder, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('order_status', 'pending')
      .maybeSingle();

    if (orderError && orderError.code !== 'PGRST116') {
      console.error("Error checking existing order:", orderError);
      return null;
    }

    let orderId = existingOrder?.id;

    if (!orderId) {
      // Create new pending order
      const orderNumber = `ORD-${Date.now()}`;
      const { data: newOrder, error: createOrderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          customer_name: user.email || '',
          customer_email: user.email || '',
          customer_phone: '',
          shipping_address: '',
          payment_method: 'pending',
          total_amount: 0,
          order_status: 'pending',
          payment_status: 'pending'
        })
        .select('id')
        .single();

      if (createOrderError) {
        console.error("Error creating pending order:", createOrderError);
        return null;
      }
      orderId = newOrder.id;
    }

    // Clear existing order items
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);

    // Add current cart items to order
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Error inserting order items:", itemsError);
        return null;
      }
    }

    // Update order total
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await supabase
      .from('orders')
      .update({ total_amount: totalAmount })
      .eq('id', orderId);

    return orderId;
  } catch (error) {
    console.error("Error creating pending cart:", error);
    return null;
  }
};

// Add product to cart
export const addToCart = async (product: Product, quantity: number = 1): Promise<CartItem | null> => {
  try {
    console.log("🛒 addToCart - Starting with product:", product.name, "quantity:", quantity, "color:", product.color);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("🔐 Auth check - User:", user?.id, "Auth error:", authError);
    
    if (user) {
      console.log("✅ User authenticated, using database cart");
      
      // Authenticated user - work with database
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('product_color', product.color || '')
        .maybeSingle();

      console.log("🔍 Fetch existing cart item result:", { existingItem, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("❌ Error fetching cart item:", fetchError);
        return null;
      }

      if (existingItem) {
        console.log("📝 Updating existing cart item:", existingItem.id);
        // Update existing item
        const { error: updateError } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error("❌ Error updating cart item:", updateError);
          return null;
        }
        console.log("✅ Cart item updated successfully");
      } else {
        console.log("➕ Adding new cart item to database");
        // Add new item
        const { data: insertData, error: insertError } = await supabase
          .from('cart')
          .insert({
            user_id: user.id,
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            unit_price: product.price,
            product_color: product.color || null
          })
          .select()
          .single();

        console.log("💾 Insert result:", { insertData, insertError });

        if (insertError) {
          console.error("❌ Error inserting cart item:", insertError);
          return null;
        }
        console.log("✅ Cart item inserted successfully:", insertData);
      }

      window.dispatchEvent(new Event("cartUpdated"));
      return {
        id: existingItem?.id || `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0],
        color: product.color
      };
    } else {
      // Guest user - use localStorage
      const cart = await getCart();
      const existingItem = cart.find(item => item.productId === product.id && item.color === product.color);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0],
          color: product.color
        };
        cart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      
      return existingItem || cart[cart.length - 1];
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (productId: string, quantity: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Authenticated user - update in database
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) {
          console.error("Error deleting cart item:", error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) {
          console.error("Error updating cart item:", error);
          return false;
        }
      }

      window.dispatchEvent(new Event("cartUpdated"));
      return true;
    } else {
      // Guest user - update localStorage
      const cart = await getCart();
      const itemIndex = cart.findIndex(item => item.productId === productId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].quantity = quantity;
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return false;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Authenticated user - delete from database
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error("Error removing cart item:", error);
        return false;
      }

      window.dispatchEvent(new Event("cartUpdated"));
      return true;
    } else {
      // Guest user - update localStorage
      const cart = await getCart();
      const filteredCart = cart.filter(item => item.productId !== productId);
      
      localStorage.setItem("cart", JSON.stringify(filteredCart));
      window.dispatchEvent(new Event("cartUpdated"));
      return true;
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

// Get cart items (async version)
export const getCartItems = async (): Promise<CartItem[]> => {
  return await getCart();
};

// Clear cart
export const clearCart = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Authenticated user - clear database cart
      await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      // Also clear pending order for authenticated users
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('order_status', 'pending')
        .maybeSingle();

      if (order) {
        // Delete order items first
        await supabase
          .from('order_items')
          .delete()
          .eq('order_id', order.id);

        // Delete the order
        await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);
      }
    } else {
      // Guest user - clear localStorage
      localStorage.removeItem("cart");
    }
    
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

// Get cart total
export const getCartTotal = async (): Promise<number> => {
  const cart = await getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get cart count
export const getCartCount = async (): Promise<number> => {
  const cart = await getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Get cart items count (alias)
export const getCartItemsCount = async (): Promise<number> => {
  return await getCartCount();
};

// Check if product is in cart
export const isInCart = async (productId: string): Promise<boolean> => {
  const cart = await getCart();
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

// Legacy function for backward compatibility
export { getCart };