
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteOwnerDialogProps {
  ownerId: string;
  ownerName: string;
  onConfirm: (ownerId: string) => void;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteOwnerDialog: React.FC<DeleteOwnerDialogProps> = ({
  ownerId,
  ownerName,
  onConfirm,
  onCancel,
  open,
  onOpenChange
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteOwner = async () => {
    if (!ownerId) return;
    
    try {
      setIsDeleting(true);
      setError(null);
      
      console.log("Deleting owner:", ownerName);
      
      // Use the security definer function to delete the user
      const { data: success, error: deleteError } = await supabase
        .rpc('delete_admin_user', { 
          user_id: ownerId 
        });
        
      if (deleteError) {
        console.error("Database error deleting owner:", deleteError);
        throw deleteError;
      }
      
      console.log("Owner deleted successfully:", success);
      
      if (success) {
        onConfirm(ownerId);
        toast.success(`Ground owner ${ownerName} deleted successfully`);
      } else {
        throw new Error("Failed to delete ground owner");
      }
      
    } catch (error: any) {
      console.error("Error deleting ground owner:", error);
      setError(error.message || "Failed to delete ground owner");
      toast.error(error.message || "Failed to delete ground owner");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Ground Owner</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ground owner? This action cannot be
            undone and all associated grounds and bookings will need to be
            reassigned.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteOwner}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOwnerDialog;
