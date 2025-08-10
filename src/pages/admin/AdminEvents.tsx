import { useState } from "react";
import { format, parseISO } from "date-fns";
import AdminLayout from "@/components/layouts/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import { Button } from "@/components/ui/button";
import EventDialog from "@/components/admin/events/EventDialog";
import DeleteEventDialog from "@/components/admin/events/DeleteEventDialog";
import { Event } from "@/types/models";
import { Edit, Plus, Trash2 } from "lucide-react";
import { hasRoleSync } from "@/utils/auth";
import { ColumnDef } from "@tanstack/react-table";

const AdminEvents = () => {
  const isSuperAdmin = hasRoleSync('super_admin');
  const { events, isLoading, deleteEvent } = useEvents();
  const { games } = useGames();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "eventName",
      header: "Event Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("eventName")}</div>
      ),
    },
    {
      accessorKey: "eventDate",
      header: "Date",
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("eventDate"))}</div>
      ),
    },
    {
      accessorKey: "eventTime",
      header: "Time",
      cell: ({ row }) => (
        <div>{row.getValue("eventTime")}</div>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <div>{row.getValue("city")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Location",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "sportId",
      header: "Sport",
      cell: ({ row }) => (
        <div>{getSportName(row.getValue("sportId"))}</div>
      ),
    },
    {
      accessorKey: "registrationUrl",
      header: "Registration",
      cell: ({ row }) => {
        const url = row.getValue("registrationUrl") as string;
        return url ? (
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View Link
          </a>
        ) : (
          "None"
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(event)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

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

        {isLoading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : (
          <DataTable
            columns={columns}
            data={events}
            searchKey="eventName"
            searchPlaceholder="Search events..."
          />
        )}
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