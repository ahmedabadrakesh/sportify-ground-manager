
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface GroundFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const GroundFormActions: React.FC<GroundFormActionsProps> = ({ 
  isLoading, 
  onCancel 
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
            Creating...
          </>
        ) : (
          "Create Ground"
        )}
      </Button>
    </div>
  );
};

export default GroundFormActions;
