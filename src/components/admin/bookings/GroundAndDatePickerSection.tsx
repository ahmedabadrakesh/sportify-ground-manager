
import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Ground } from "@/types/models";
import { format } from "date-fns";

interface GroundAndDatePickerSectionProps {
  grounds: Ground[];
  selectedGround: string;
  handleGroundChange: (groundId: string) => void;
  selectedDate: Date;
  handleDateChange: (date: Date | undefined) => void;
}

const GroundAndDatePickerSection: React.FC<GroundAndDatePickerSectionProps> = ({
  grounds,
  selectedGround,
  handleGroundChange,
  selectedDate,
  handleDateChange
}) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="ground">Select Ground</Label>
      <Select
        value={selectedGround}
        onValueChange={handleGroundChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a ground" />
        </SelectTrigger>
        <SelectContent>
          {grounds.map((ground) => (
            <SelectItem key={ground.id} value={ground.id}>
              {ground.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="date">Select Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={!selectedGround}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  </>
);

export default GroundAndDatePickerSection;
