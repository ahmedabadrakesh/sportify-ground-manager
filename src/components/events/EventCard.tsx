
import { Calendar, MapPin, Link as LinkIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types/models";

interface EventCardProps {
  event: Event;
  sportName: string;
  onEventClick: (url?: string) => void;
}

const EventCard = ({ event, sportName, onEventClick }: EventCardProps) => {
  // Format event date helper function
  const formatEventDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Card 
      key={event.id} 
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col ${event.registrationUrl ? 'cursor-pointer hover:-translate-y-1 hover:bg-gray-50' : ''}`}
      onClick={() => event.registrationUrl && onEventClick(event.registrationUrl)}
    >
      {event.image ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.eventName} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      
      <CardContent className="pt-6 flex-grow flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
            {sportName}
          </span>
          <span className="text-sm text-muted-foreground">{formatEventDate(event.eventDate)}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{event.eventName}</h3>
        
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <span className="text-sm text-muted-foreground">{event.address}, {event.city}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{event.eventTime}</span>
        </div>
        
        <div className="mt-auto">
          {event.registrationUrl ? (
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mt-4"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click from triggering
                window.open(event.registrationUrl, "_blank");
              }}
            >
              <LinkIcon className="h-4 w-4" />
              Register Now
            </Button>
          ) : (
            <div className="w-full px-4 py-2 text-center text-sm text-gray-500 mt-4">
              Registration not available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
