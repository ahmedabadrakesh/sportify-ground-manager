
import React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/models";
import { StatusBadge } from "./StatusBadge";

interface BookingDetailsDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelBooking: (bookingId: string) => void;
}

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  
  if (hourNum === 0) {
    return "12:00 AM";
  } else if (hourNum < 12) {
    return `${hourNum}:${minute} AM`;
  } else if (hourNum === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hourNum - 12}:${minute} PM`;
  }
};

const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  booking,
  isOpen,
  onOpenChange,
  onCancelBooking
}) => {
  if (!booking) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Booking ID
              </h3>
              <p className="font-mono text-sm">{booking.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Booking Date
              </h3>
              <p>
                {format(new Date(booking.date), "PPP")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Customer
              </h3>
              <p className="font-medium">{booking.userName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Contact
              </h3>
              <p>{booking.userPhone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Ground
              </h3>
              <p>{booking.groundName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Status
              </h3>
              <StatusBadge status={booking.bookingStatus} />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Booked Slots
            </h3>
            <div className="bg-gray-50 rounded-md p-3 space-y-2">
              {booking.slots && booking.slots.length > 0 ? (
                booking.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <span className="font-medium">₹{slot.price}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-2">No time slots available</div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-primary-700">
                ₹{booking.totalAmount}
              </p>
            </div>
            
            {booking.bookingStatus !== "cancelled" && (
              <Button
                variant="destructive"
                onClick={() => onCancelBooking(booking.id)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
