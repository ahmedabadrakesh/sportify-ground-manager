
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBookings, cancelBooking } from "@/services/booking";
import { fetchGrounds } from "@/services/groundsService";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { Booking, Ground } from "@/types/models";
import BookingsTable from "@/components/admin/bookings/BookingsTable";
import BookingDetailsDialog from "@/components/admin/bookings/BookingDetailsDialog";
import AddBookingDialog from "@/components/admin/bookings/AddBookingDialog";

const AdminBookings: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
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
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [currentUser, isSuperAdmin]);
  
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
      ) : (
        <BookingsTable 
          bookings={bookings} 
          onViewDetails={handleViewDetails} 
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
