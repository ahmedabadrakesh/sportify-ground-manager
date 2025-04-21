
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { TimeSlot } from "@/types/models";

interface TimeSlotSectionProps {
  loadingSlots: boolean;
  availableSlots: TimeSlot[];
  selectedSlots: string[];
  onSelectSlot: (slotId: string) => void;
  show: boolean;
}

const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  loadingSlots,
  availableSlots,
  selectedSlots,
  onSelectSlot,
  show
}) => {
  if (!show) return null;
  if (loadingSlots) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Loading available time slots...</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <TimeSlotPicker
      slots={availableSlots}
      selectedSlots={selectedSlots}
      onSelectSlot={onSelectSlot}
    />
  );
};

export default TimeSlotSection;
