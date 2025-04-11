
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderAmount, paymentMethod } = location.state || {};

  // If no order info is available, redirect to home
  if (!orderId) {
    React.useEffect(() => {
      navigate("/");
    }, [navigate]);
    
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto my-12 px-4">
        <Card className="border-green-100 shadow-md">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Order Confirmed!
              </h1>
              
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="font-medium">{orderId}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium">
                    {paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="font-medium">₹{orderAmount}</p>
                </div>
              </div>
            </div>
            
            <div className="text-gray-700 mb-8">
              <p className="mb-4">
                We've sent you an email with your order details and tracking information.
              </p>
              <p>
                If you have any questions about your order, please contact our customer support team.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Return to Home
              </Button>
              
              <Button 
                className="flex-1"
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;
