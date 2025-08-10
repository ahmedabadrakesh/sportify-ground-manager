
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CartSummaryProps {
  totalAmount: number;
  hasItems: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalAmount, hasItems }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!hasItems) {
      toast({ title: "Error", description: "Your cart is empty", variant: "destructive" });
      return;
    }
    
    navigate("/checkout");
  };

  return (
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
  );
};

export default CartSummary;
