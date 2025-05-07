
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsHeaderProps {
  onAddEvent: () => void;
}

const EventsHeader = ({ onAddEvent }: EventsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Upcoming Sports Events</h1>
      <Button 
        className="mt-4 md:mt-0 flex items-center gap-2" 
        onClick={onAddEvent}
      >
        <Plus className="h-4 w-4" /> Add Event
      </Button>
    </div>
  );
};

export default EventsHeader;
