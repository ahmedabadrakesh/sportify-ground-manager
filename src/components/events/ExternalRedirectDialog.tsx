
import React from "react";
import { X, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExternalRedirectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  eventName: string;
}

const ExternalRedirectDialog = ({
  open,
  onOpenChange,
  url,
  eventName,
}: ExternalRedirectDialogProps) => {
  const handleConfirm = () => {
    window.open(url, "_blank");
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Redirect Confirmation
          </DialogTitle>
          <DialogDescription className="text-left">
            You are being redirected to an external website for the event "{eventName}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Destination:</p>
            <p className="text-sm font-mono break-all">{url}</p>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalRedirectDialog;
