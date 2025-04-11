
import { CartItem } from "@/types/models";

// Get cart from localStorage
export const getCart = (): CartItem[] => {
  const cartJson = localStorage.getItem('cart');
  return cartJson ? JSON.parse(cartJson) : [];
};

// Add item to cart
export const addToCart = (productId: string, quantity: number): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Update cart item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

// Remove item from cart
export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Clear cart
export const clearCart = (): void => {
  localStorage.removeItem('cart');
};

// Get cart total items count
export const getCartItemsCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Calculate cart total amount
export const getCartTotal = (cartItems: { productId: string; quantity: number; product?: any }[]): number => {
  return cartItems.reduce((total, item) => {
    if (item.product) {
      return total + (item.product.price * item.quantity);
    }
    return total;
  }, 0);
};

// Process checkout (in a real app, this would integrate with a payment gateway)
export const processCheckout = async (
  orderData: {
    items: CartItem[];
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    paymentMethod: string;
    totalAmount: number;
  }
): Promise<{ success: boolean; orderId?: string; message?: string }> => {
  // Simulate API call processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, you would send orderData to your backend
  // and create an order in your database

  // For demo purposes, we'll just simulate a successful checkout 90% of the time
  const isSuccessful = Math.random() < 0.9;
  
  if (isSuccessful) {
    // Clear the cart after successful checkout
    clearCart();
    return {
      success: true,
      orderId: `ORD-${Date.now()}`,
      message: "Order placed successfully!"
    };
  } else {
    return {
      success: false,
      message: "Payment processing failed. Please try again."
    };
  }
};
