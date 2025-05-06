
import { useState } from "react";
import { format, parseISO } from "date-fns";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell, TableFooter 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventDialog from "@/components/admin/events/EventDialog";
import DeleteEventDialog from "@/components/admin/events/DeleteEventDialog";
import { Event } from "@/types/models";
import { Calendar, Edit, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { hasRoleSync } from "@/utils/auth";

const AdminEvents = () => {
  const isSuperAdmin = hasRoleSync('super_admin');
  const { events, isLoading, deleteEvent } = useEvents();
  const { games } = useGames();
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(search.toLowerCase()) ||
    event.address.toLowerCase().includes(search.toLowerCase()) ||
    event.city.toLowerCase().includes(search.toLowerCase())
  );

  const getSportName = (sportId?: string) => {
    if (!sportId) return "General";
    const game = games.find(g => g.id === sportId);
    return game ? game.name : "General";
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Events Management</h1>
            <p className="text-muted-foreground">
              Create and manage sports events
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Loading events data...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.eventName}</TableCell>
                      <TableCell>{formatDate(event.eventDate)}</TableCell>
                      <TableCell>{event.eventTime}</TableCell>
                      <TableCell>{event.city}</TableCell>
                      <TableCell>{getSportName(event.sportId)}</TableCell>
                      <TableCell>
                        {event.registrationUrl ? (
                          <a 
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Link
                          </a>
                        ) : (
                          "None"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(event)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Create Event Dialog */}
      <EventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
      
      {/* Edit Event Dialog */}
      {selectedEvent && (
        <EventDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          mode="edit"
          event={selectedEvent}
        />
      )}
      
      {/* Delete Event Dialog */}
      {selectedEvent && (
        <DeleteEventDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          eventName={selectedEvent.eventName}
          onDelete={confirmDelete}
        />
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
