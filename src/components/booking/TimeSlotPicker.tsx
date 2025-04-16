
import React from "react";
import { TimeSlot } from "@/types/models";
import TimeSlotGroup from "./TimeSlotGroup";
import MockSlotsAlert from "./MockSlotsAlert";

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
      
      {hasMockSlots && <MockSlotsAlert />}
      
      {Object.entries(groupedByTimeOfDay).map(([timeOfDay, timeSlots]) => (
        <TimeSlotGroup
          key={timeOfDay}
          title={timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}
          slots={timeSlots}
          selectedSlots={selectedSlots}
          onSelectSlot={onSelectSlot}
        />
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
