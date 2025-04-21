
import React from "react";
import { Ground } from "@/types/models";
import { format } from "date-fns";

interface BookingSummaryProps {
  ground: Ground;
  date: Date;
  selectedSlots: string[];
  amountPerSlot: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  ground,
  date,
  selectedSlots,
  amountPerSlot,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-lg mb-3">Booking Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Ground:</span>
          <span className="font-medium">{ground.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{date ? format(date, "PPP") : ""}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Slots:</span>
          <span className="font-medium">
            {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-bold text-primary-700">
            ₹{selectedSlots.length * amountPerSlot}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
