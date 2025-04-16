
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GroundFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
  isEditMode?: boolean;
}

const GroundFormActions: React.FC<GroundFormActionsProps> = ({ 
  isLoading, 
  onCancel,
  isEditMode = false
}) => {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        variant="outline"
        className="mr-2"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          isEditMode ? "Update Ground" : "Create Ground"
        )}
      </Button>
    </div>
  );
};

export default GroundFormActions;
