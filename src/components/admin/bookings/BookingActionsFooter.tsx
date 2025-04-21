
import React from "react";
import { Button } from "@/components/ui/button";

interface BookingActionsFooterProps {
  onCancel: () => void;
  onCreate: () => void;
  canCreate: boolean;
}

const BookingActionsFooter: React.FC<BookingActionsFooterProps> = ({
  onCancel,
  onCreate,
  canCreate
}) => (
  <div className="flex justify-end space-x-2">
    <Button
      variant="outline"
      onClick={onCancel}
    >
      Cancel
    </Button>
    <Button
      onClick={onCreate}
      disabled={!canCreate}
    >
      Create Booking
    </Button>
  </div>
);

export default BookingActionsFooter;
