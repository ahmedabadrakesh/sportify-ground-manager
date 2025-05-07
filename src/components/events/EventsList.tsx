
import { Event } from "@/types/models";
import EventCard from "./EventCard";

interface EventsListProps {
  events: Event[];
  getSportName: (sportId?: string) => string;
  handleEventClick: (url?: string) => void;
  isLoading: boolean;
}

const EventsList = ({ events, getSportName, handleEventClick, isLoading }: EventsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No events found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          sportName={getSportName(event.sportId)}
          onEventClick={handleEventClick}
        />
      ))}
    </div>
  );
};

export default EventsList;
