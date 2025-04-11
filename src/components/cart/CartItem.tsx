
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { updateCartItemQuantity, removeFromCart } from "@/utils/cart";
import { Product } from "@/types/models";

interface CartItemProps {
  productId: string;
  quantity: number;
  product: Product;
  onUpdate: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ productId, quantity, product, onUpdate }) => {
  const subtotal = product.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= product.stock && newQuantity >= 1) {
      updateCartItemQuantity(productId, newQuantity);
      onUpdate();
    } else if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
    }
  };

  const handleRemove = () => {
    removeFromCart(productId);
    onUpdate();
    toast.success("Item removed from cart");
  };

  return (
    <div className="flex items-center py-4 border-b last:border-0">
      <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden mr-4">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="font-semibold">₹{product.price}</p>
      </div>
      
      <div className="flex items-center mr-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="mx-2 w-8 text-center">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= product.stock}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="text-right w-24 mr-2">
        <p className="font-semibold">₹{subtotal}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="text-gray-500"
        onClick={handleRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
