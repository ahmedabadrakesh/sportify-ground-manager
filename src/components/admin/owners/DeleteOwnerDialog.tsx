
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteOwnerDialogProps {
  ownerId: string;
  owners: any[];
  onSuccess: (ownerId: string) => void;
  onCancel: () => void;
}

const DeleteOwnerDialog: React.FC<DeleteOwnerDialogProps> = ({
  ownerId,
  owners,
  onSuccess,
  onCancel
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOwner = async () => {
    if (!ownerId) return;
    
    try {
      setIsDeleting(true);
      const ownerToDelete = owners.find(owner => owner.id === ownerId);
      
      if (!ownerToDelete) {
        toast.error("Owner not found");
        return;
      }
      
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', ownerId);
        
      if (userError) {
        throw userError;
      }
      
      onSuccess(ownerId);
      toast.success(`Ground owner ${ownerToDelete.name} deleted successfully`);
      
    } catch (error: any) {
      console.error("Error deleting ground owner:", error);
      toast.error(error.message || "Failed to delete ground owner");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Ground Owner</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this ground owner? This action cannot be
          undone and all associated grounds and bookings will need to be
          reassigned.
        </DialogDescription>
      </DialogHeader>
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
  );
};

export default DeleteOwnerDialog;
