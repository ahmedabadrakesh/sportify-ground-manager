
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types/models";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  // Check if slots are mock data
  const hasMockSlots = slots.length > 0 && slots[0].id.startsWith('mock-');

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

  // Group slots by time of day (morning, afternoon, evening)
  const groupedByTimeOfDay = {
    morning: slots.filter(slot => {
      const hour = parseInt(slot.startTime.split(":")[0]);
      return hour >= 6 && hour < 12;
    }),
    afternoon: slots.filter(slot => {
      const hour = parseInt(slot.startTime.split(":")[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: slots.filter(slot => {
      const hour = parseInt(slot.startTime.split(":")[0]);
      return hour >= 17 || hour < 6;
    })
  };

  const timeOfDayLabels = {
    morning: "Morning (6 AM - 12 PM)",
    afternoon: "Afternoon (12 PM - 5 PM)",
    evening: "Evening (5 PM - 10 PM)"
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Available Time Slots</h3>
      
      {hasMockSlots && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            These are preview time slots. Actual booking will be confirmed by admin.
          </AlertDescription>
        </Alert>
      )}
      
      {Object.entries(groupedByTimeOfDay).map(([timeOfDay, timeSlots]) => (
        timeSlots.length > 0 && (
          <div key={timeOfDay} className="space-y-4">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              {timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
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
        )
      ))}

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
