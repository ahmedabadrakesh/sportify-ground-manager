import React from "react";
import { Button } from "@/components/ui/button";
import { Delete, Minus, Plus, Recycle, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { updateCartItemQuantity, removeFromCart } from "@/utils/cart";
import { Product } from "@/types/models";

interface CartItemProps {
  productId: string;
  quantity: number;
  product: Product;
  selectedColor?: string;
  onUpdate: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  productId,
  quantity,
  product,
  selectedColor,
  onUpdate,
}) => {
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

  const QuantitySection = () => {
    return (
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
    );
  };

  return (
    <div className="flex items-center border-b last:border-0 w-full items-center">
      <div className="h-20 w-20 md:h-32 md:w-32 bg-gray-100 rounded-md overflow-hidden mr-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center w-full">
          <div className="flex flex-col items-left text-left w-[90%] md:w-[55%] gap-2">
            <h3 className="font-medium">
              {`${product.name.substring(0, 30)}${
                product.name.length > 30 ? "..." : ""
              }`}
            </h3>
            <div className="flex flex-row gap-4">
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="flex flex-row gap-2">
                {selectedColor &&
                  selectedColor.split(",").map((colorCode) => {
                    return (
                      <button
                        key={colorCode}
                        className={`w-5 h-5 rounded-full mr-2 border-2 hover:scale-110 transition-transform ${
                          selectedColor === colorCode
                            ? "border-primary border-3 ring-2 ring-primary/30"
                            : "border-gray-400 hover:border-gray-600"
                        }`}
                        style={{ backgroundColor: colorCode }}
                        title={`Select ${colorCode} color`}
                      />
                    );
                  })}
              </div>
              <p className="font-semibold">₹{product.price}</p>
            </div>
          </div>

          <div className="hidden md:block w-[20%]">
            <QuantitySection />
          </div>
          <div className="hidden md:block  text-right mr-2 w-[20%]">
            <p className="font-semibold">₹{subtotal}</p>
          </div>

          <div className="flex text-right w-[10%] md:w-[5%] aligh-top height-full -mt-8 md:mt-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 aligh-top"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="block md:hidden flex flex-row mt-2">
          <div className="w-[80%]">
            <QuantitySection />
          </div>
          <div className="text-right w-24 mr-2 w-[20%]">
            <p className="font-semibold">₹{subtotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
