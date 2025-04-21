
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerDetailsSectionProps {
  customerName: string;
  customerPhone: string;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  disabled?: boolean;
}

const CustomerDetailsSection: React.FC<CustomerDetailsSectionProps> = ({
  customerName,
  customerPhone,
  setCustomerName,
  setCustomerPhone,
  disabled
}) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="customerName">Customer Name</Label>
      <Input
        id="customerName"
        placeholder="Enter customer name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        disabled={disabled}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="customerPhone">Customer Phone</Label>
      <Input
        id="customerPhone"
        placeholder="Enter customer phone number"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        disabled={disabled}
      />
    </div>
  </>
);

export default CustomerDetailsSection;
