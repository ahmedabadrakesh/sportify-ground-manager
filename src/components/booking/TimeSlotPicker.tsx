
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types/models";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlots,
  onSelectSlot,
}) => {
  // Group slots by hour
  const groupedSlots: Record<string, TimeSlot[]> = {};
  slots.forEach((slot) => {
    const hour = slot.startTime.split(":")[0];
    if (!groupedSlots[hour]) {
      groupedSlots[hour] = [];
    }
    groupedSlots[hour].push(slot);
  });

  // Format time for display
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Available Time Slots</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedSlots).map(([hour, hourSlots]) => (
          <div key={hour} className="bg-white rounded-lg shadow-sm border p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {formatTime(`${hour}:00`)}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {hourSlots.map((slot) => (
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
        ))}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">No available slots for the selected date.</p>
        </div>
      )}

      {selectedSlots.length > 0 && (
        <div className="mt-4 bg-green-50 rounded-md p-4">
          <p className="text-sm text-green-700">
            You have selected {selectedSlots.length} slot(s).
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
