
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types/models";
import { formatTime } from "./TimeSlotFormatter";

interface TimeSlotGroupProps {
  title: string;
  slots: TimeSlot[];
  selectedSlots: string[];
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotGroup: React.FC<TimeSlotGroupProps> = ({
  title,
  slots,
  selectedSlots,
  onSelectSlot,
}) => {
  if (slots.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 border-b pb-2">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <Button
            key={slot.id}
            variant="outline"
            onClick={() => onSelectSlot(slot.id)}
            className={cn(
              "justify-between h-auto py-3",
              selectedSlots.includes(slot.id)
                ? "bg-primary-100 border-primary-300 text-primary-800"
                : ""
            )}
            disabled={slot.isBooked}
          >
            <span>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </span>
            <span className="text-sm font-semibold">₹{slot.price}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGroup;
