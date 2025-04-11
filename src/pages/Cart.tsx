
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { getCart } from "@/utils/cart";
import { products } from "@/data/mockData";
import { CartItem as CartItemType } from "@/types/models";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
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
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <CartItem 
                        key={item.productId} 
                        productId={item.productId}
                        quantity={item.quantity}
                        product={item.product!}
                        onUpdate={loadCart}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <CartSummary 
                totalAmount={totalAmount} 
                hasItems={cartItems.length > 0}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
