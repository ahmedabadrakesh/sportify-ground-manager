
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
