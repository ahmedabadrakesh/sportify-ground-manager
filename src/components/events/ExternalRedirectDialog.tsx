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
import externalLinkimage from "/externalLinkimage.png";

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
        <DialogHeader className="flex items-center gap-2">
          <img
            src={externalLinkimage}
            className="w-12 h-auto object-cover rounded-lg mt-6"
          ></img>
          <DialogTitle className="text-xl flex items-center gap-2">
            External Redirect Confirmation
          </DialogTitle>
          <DialogDescription className="text-base text-left pt-4">
            You are being redirected to an external website for the event "
            <b>{eventName}</b>".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Destination:</p>
            <p className="text-sm break-all">{url}</p>
          </div>

          <p className="text-xs pt-6 pb-6 text-left">
            Disclaimer: Jokova is a platform that simply lists events sourced
            from various websites and organizers. We do not host, manage, or
            take responsibility for any of the events listed. Event details,
            including dates, locations, and content, are subject to change
            without notice and should be verified with the official event
            organizers. Jokova is not liable for any issues, losses, or damages
            that may arise from attending or participating in any listed events.
          </p>

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
