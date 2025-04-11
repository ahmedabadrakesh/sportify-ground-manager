
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-500 mb-6">Your cart is empty</p>
      <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
    </div>
  );
};

export default EmptyCart;
