
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types/models";
import { formatTime } from "./TimeSlotFormatter";

interface TimeSlotGroupProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onSelectSlot: (slotId: string) => void;
  title?: string;
}

const TimeSlotGroup: React.FC<TimeSlotGroupProps> = ({
  slots,
  selectedSlots,
  onSelectSlot,
}) => {
  if (slots.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      {slots.map((slot) => (
        <Button
          key={slot.id}
          variant="outline"
          onClick={() => onSelectSlot(slot.id)}
          className={cn(
            "w-full justify-between h-auto py-3 px-4",
            selectedSlots.includes(slot.id)
              ? "bg-primary-100 border-primary-300 text-primary-800"
              : ""
          )}
          disabled={slot.isBooked}
        >
          <span className="text-sm">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </span>
          <span className="text-sm font-semibold">₹{slot.price}</span>
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotGroup;
