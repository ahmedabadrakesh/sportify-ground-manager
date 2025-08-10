import React, { useState, useEffect } from "react";
import { Calendar, Eye, X } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBookings, cancelBooking } from "@/services/booking";
import { fetchGrounds } from "@/services/groundsService";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { Booking, Ground } from "@/types/models";
import BookingDetailsDialog from "@/components/admin/bookings/BookingDetailsDialog";
import AddBookingDialog from "@/components/admin/bookings/AddBookingDialog";
import { StatusBadge } from "@/components/admin/bookings/StatusBadge";
import { ColumnDef } from "@tanstack/react-table";

const AdminBookings: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch grounds first
      const groundsData = await fetchGrounds({ 
        isSuperAdmin, 
        currentUserId: currentUser?.id 
      });
      setGrounds(groundsData);
      
      // Then fetch bookings
      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const cancelled = await cancelBooking(bookingId);
      
      if (cancelled) {
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, bookingStatus: 'cancelled', paymentStatus: 'cancelled' } 
              : booking
          )
        );
        
        toast.success("Booking cancelled successfully");
        setIsDetailsOpen(false);
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("An error occurred while cancelling the booking");
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue("id")?.toString().slice(0, 8)}...
        </div>
      ),
    },
    {
      accessorKey: "user_id",
      header: "Customer",
      cell: ({ row }) => (
        <div className="font-medium">
          Customer {row.getValue("user_id")?.toString().slice(0, 8)}
        </div>
      ),
    },
    {
      accessorKey: "ground_id",
      header: "Ground",
      cell: ({ row }) => {
        const ground = grounds.find(g => g.id === row.getValue("ground_id"));
        return <div className="font-medium">{ground?.name || "Unknown Ground"}</div>;
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("bookingStatus")} />
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ₹{parseFloat(row.getValue("total_amount")).toFixed(2)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(booking)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {booking.bookingStatus === "confirmed" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">
            Manage bookings for {isSuperAdmin ? "all grounds" : "your grounds"}
          </p>
        </div>
        
        <Button 
          className="flex items-center"
          onClick={() => setIsAddBookingOpen(true)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="p-6">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Try Again
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          searchKey="id"
          searchPlaceholder="Search bookings..."
        />
      )}

      <BookingDetailsDialog
        booking={selectedBooking}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onCancelBooking={handleCancelBooking}
      />

      <AddBookingDialog
        isOpen={isAddBookingOpen}
        onOpenChange={setIsAddBookingOpen}
        grounds={grounds}
        onBookingCreated={fetchData}
        currentUserId={currentUser?.id}
      />
    </AdminLayout>
  );
};

export default AdminBookings;