
import React, { useState } from "react";
import { TimeSlot } from "@/types/models";
import TimeSlotGroup from "./TimeSlotGroup";
import MockSlotsAlert from "./MockSlotsAlert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [showNonConsecutiveAlert, setShowNonConsecutiveAlert] = useState(false);
  const [pendingSlotSelection, setPendingSlotSelection] = useState<string | null>(null);
  
  const hasMockSlots = slots.length > 0 && slots[0].id.startsWith('mock-');

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

  const areConsecutiveSlots = (currentSlots: string[]) => {
    if (currentSlots.length <= 1) return true;
    
    const sortedSlots = slots
      .filter(slot => currentSlots.includes(slot.id))
      .sort((a, b) => {
        const timeA = parseInt(a.startTime.split(':')[0]);
        const timeB = parseInt(b.startTime.split(':')[0]);
        return timeA - timeB;
      });

    for (let i = 1; i < sortedSlots.length; i++) {
      const prevTime = parseInt(sortedSlots[i-1].endTime.split(':')[0]);
      const currTime = parseInt(sortedSlots[i].startTime.split(':')[0]);
      if (currTime !== prevTime) {
        return false;
      }
    }
    return true;
  };

  const handleSlotSelect = (slotId: string) => {
    const newSelection = selectedSlots.includes(slotId)
      ? selectedSlots.filter(id => id !== slotId)
      : [...selectedSlots, slotId];

    if (!areConsecutiveSlots(newSelection)) {
      setPendingSlotSelection(slotId);
      setShowNonConsecutiveAlert(true);
    } else {
      onSelectSlot(slotId);
    }
  };

  const handleConfirmNonConsecutive = () => {
    if (pendingSlotSelection) {
      onSelectSlot(pendingSlotSelection);
    }
    setShowNonConsecutiveAlert(false);
    setPendingSlotSelection(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Available Time Slots</h3>
      
      {hasMockSlots && <MockSlotsAlert />}
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {Object.entries(groupedByTimeOfDay).map(([timeOfDay, timeSlots]) => (
          timeSlots.length > 0 && (
            <AccordionItem key={timeOfDay} value={timeOfDay}>
              <AccordionTrigger className="text-left font-medium text-gray-700">
                {timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}
              </AccordionTrigger>
              <AccordionContent>
                <TimeSlotGroup
                  slots={timeSlots}
                  selectedSlots={selectedSlots}
                  onSelectSlot={handleSlotSelect}
                />
              </AccordionContent>
            </AccordionItem>
          )
        ))}
      </Accordion>

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

      <AlertDialog open={showNonConsecutiveAlert} onOpenChange={setShowNonConsecutiveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Non-Consecutive Time Slots</AlertDialogTitle>
            <AlertDialogDescription>
              You are selecting non-consecutive time slots. This might lead to gaps in your booking. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowNonConsecutiveAlert(false);
              setPendingSlotSelection(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNonConsecutive}>
              Continue Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TimeSlotPicker;
