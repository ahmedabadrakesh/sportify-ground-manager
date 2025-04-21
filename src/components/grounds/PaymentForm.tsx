
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentFormProps {
  onCompleteBooking: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onCompleteBooking }) => {
  return (
    <div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-lg mb-3">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={onCompleteBooking}>Complete Booking</Button>
      </div>
    </div>
  );
};

export default PaymentForm;
