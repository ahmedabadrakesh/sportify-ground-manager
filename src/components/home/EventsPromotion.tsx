import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import ExternalRedirectDialog from "@/components/events/ExternalRedirectDialog";

const EventsPromotion = () => {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const { games } = useGames();
  const [redirectDialog, setRedirectDialog] = useState({
    open: false,
    url: "",
    eventName: "",
  });

  // Get current date for comparison
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

  // Filter only upcoming events and get the first 3
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= currentDate;
    })
    .slice(0, 3);

  const getSportName = (sportId?: string) => {
    if (!sportId) return "General";
    const game = games.find((g) => g.id === sportId);
    return game ? game.name : "General";
  };

  const formatEventDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  const handleEventClick = (url?: string, eventName?: string) => {
    if (url) {
      setRedirectDialog({
        open: true,
        url,
        eventName: eventName || "Event",
      });
    }
  };

  if (isLoading || upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {upcomingEvents.map((event) => (
          <Card
            key={event.id}
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col ${
              event.registrationUrl
                ? "cursor-pointer hover:-translate-y-1 hover:bg-gray-50"
                : ""
            }`}
            onClick={() =>
              event.registrationUrl &&
              handleEventClick(event.registrationUrl, event.eventName)
            }
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
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                  {getSportName(event.sportId)}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{event.eventName}</h3>

              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatEventDate(event.eventDate)}
                </span>
              </div>

              <div className="flex items-start gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground truncate">
                  {event.city}
                </span>
              </div>

              <div className="mt-auto">
                {event.registrationUrl && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card click from triggering
                      handleEventClick(event.registrationUrl, event.eventName);
                    }}
                  >
                    Visit Event Detail
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs pt-6 text-left">
        Disclaimer: Jokova is a platform that simply lists events sourced from
        various websites and organizers. We do not host, manage, or take
        responsibility for any of the events listed. Event details, including
        dates, locations, and content, are subject to change without notice and
        should be verified with the official event organizers. Jokova is not
        liable for any issues, losses, or damages that may arise from attending
        or participating in any listed events.
      </p>
      <div className="flex justify-center mt-8">
        <Button
          className="mt-4 md:mt-0 flex items-center gap-2"
          onClick={() => navigate("/events")}
        >
          View All Events <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <ExternalRedirectDialog
        open={redirectDialog.open}
        onOpenChange={(open) =>
          setRedirectDialog((prev) => ({ ...prev, open }))
        }
        url={redirectDialog.url}
        eventName={redirectDialog.eventName}
      />
    </div>
  );
};

export default EventsPromotion;
