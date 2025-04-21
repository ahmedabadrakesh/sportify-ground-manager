
import React from "react";
import { Clock } from "lucide-react";
import { TimeSlot } from "@/types/models";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { Label } from "@/components/ui/label";

interface TimeSlotSelectorProps {
  loading: boolean;
  availableSlots: TimeSlot[];
  selectedSlots: string[];
  onSelectSlot: (slotId: string) => void;
  selectedSportsArea?: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  loading,
  availableSlots,
  selectedSlots,
  onSelectSlot,
  selectedSportsArea,
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <Label className="text-gray-700 font-medium">Available Time Slots</Label>
      <div className="text-sm text-gray-500 flex items-center">
        <Clock size={14} className="mr-1" />
        <span>Each slot is for 1 hour</span>
      </div>
    </div>
    {loading ? (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading available slots...</p>
      </div>
    ) : availableSlots.length === 0 ? (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No available slots for the selected date{selectedSportsArea ? ` and sports area` : ''}.</p>
        <p className="text-sm text-gray-400 mt-1">Try selecting a different date{selectedSportsArea ? ' or sports area' : ''}.</p>
      </div>
    ) : (
      <TimeSlotPicker
        slots={availableSlots}
        selectedSlots={selectedSlots}
        onSelectSlot={onSelectSlot}
      />
    )}
  </div>
);

export default TimeSlotSelector;
