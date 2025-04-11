
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, X, Plus, Minus, CreditCard } from "lucide-react";
import { getCart, updateCartItemQuantity, removeFromCart, clearCart } from "@/utils/cart";
import { products } from "@/data/mockData";
import { CartItem } from "@/types/models";
import { toast } from "sonner";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCart(getCart());
    setLoading(false);
  }, []);

  // Get product details for cart items
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { 
      ...item, 
      product,
      subtotal: product ? product.price * item.quantity : 0
    };
  }).filter(item => item.product); // Filter out any items where product wasn't found

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    
    if (product && newQuantity <= product.stock && newQuantity >= 1) {
      updateCartItemQuantity(productId, newQuantity);
      setCart(getCart());
    } else if (product && newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setCart(getCart());
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    navigate("/checkout");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading cart...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <ShoppingBag className="mr-2 h-6 w-6" /> Your Shopping Cart
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.productId} className="flex items-center py-4 border-b last:border-0">
                        <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden mr-4">
                          <img 
                            src={item.product?.images[0]} 
                            alt={item.product?.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product?.name}</h3>
                          <p className="text-sm text-gray-500">{item.product?.category}</p>
                          <p className="font-semibold">₹{item.product?.price}</p>
                        </div>
                        
                        <div className="flex items-center mr-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= (item.product?.stock || 0)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right w-24 mr-2">
                          <p className="font-semibold">₹{item.subtotal}</p>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-gray-500"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₹0</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/shop")}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
