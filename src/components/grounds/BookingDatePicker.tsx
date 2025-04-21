
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BookingDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const BookingDatePicker: React.FC<BookingDatePickerProps> = ({ date, setDate }) => {
  return (
    <div>
      <Label htmlFor="date" className="block mb-2 text-gray-700 font-medium">
        Select Date
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal border border-primary-200"
            id="date"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={newDate => newDate && setDate(newDate)}
            initialFocus
            disabled={d => d < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BookingDatePicker;
