import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { getCartCount } from "@/utils/cart";

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className = "h-5 w-5" }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Update cart count on mount
    const updateCartCount = async () => {
      const count = await getCartCount();
      setCartCount(count);
    };
    
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = async () => {
      const count = await getCartCount();
      setCartCount(count);
    };

    // Add event listener for cart updates
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <div className="relative">
      <ShoppingCart className={className} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
