
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";

const EventsPromotion = () => {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const { games } = useGames();
  
  // Get only the upcoming 3 events
  const upcomingEvents = events.slice(0, 3);
  
  const getSportName = (sportId?: string) => {
    if (!sportId) return "General";
    const game = games.find(g => g.id === sportId);
    return game ? game.name : "General";
  };
  
  const formatEventDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading || upcomingEvents.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
            
            <CardContent className="pt-6">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                  {getSportName(event.sportId)}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{event.eventName}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatEventDate(event.eventDate)}</span>
              </div>
              
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground truncate">{event.city}</span>
              </div>
              
              {event.registrationUrl && (
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => window.open(event.registrationUrl, "_blank")}
                >
                  Register
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/events")}
        >
          View All Events <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EventsPromotion;
