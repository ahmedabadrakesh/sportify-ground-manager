
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddOwnerFormProps {
  onSuccess: (newOwner: any) => void;
  onCancel: () => void;
}

const AddOwnerForm: React.FC<AddOwnerFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log("Creating ground owner:", { 
        name: formData.name, 
        email: formData.email,
        role: 'admin'
      });
      
      // Use RPC function to add a user
      const { data: userData, error: userError } = await supabase
        .rpc('add_admin_user', {
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          user_whatsapp: formData.whatsapp || formData.phone
        });
        
      if (userError) {
        console.error("Database error creating owner:", userError);
        throw userError;
      }
      
      console.log("Created ground owner:", userData);
      
      if (userData) {
        onSuccess(userData);
        toast.success(`Ground owner ${formData.name} added successfully`);
      } else {
        throw new Error("No data returned after creating owner");
      }
      
    } catch (error: any) {
      console.error("Error adding ground owner:", error);
      setError(error.message || "Failed to add ground owner");
      toast.error(error.message || "Failed to add ground owner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <DialogHeader>
        <DialogTitle>Add New Ground Owner</DialogTitle>
        <DialogDescription>
          Create a new account for a ground owner with management access.
        </DialogDescription>
      </DialogHeader>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Smith"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="555-123-4567"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            placeholder="555-123-4567"
            value={formData.whatsapp}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <p className="text-xs text-gray-500">
          This password will be used for account access.
        </p>
      </div>
      
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddOwnerForm;
