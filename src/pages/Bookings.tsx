
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cancelBooking, getUserBookings } from "@/utils/booking";
import { Booking } from "@/types/models";
import { getCurrentUserSync, isAuthenticatedSync } from "@/utils/auth";
import { toast } from "sonner";

const BookingStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === "confirmed") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirmed
      </Badge>
    );
  } else if (status === "cancelled") {
    return (
      <Badge variant="destructive">
        <XCircle className="w-3.5 h-3.5 mr-1" /> Cancelled
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Pending
      </Badge>
    );
  }
};

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  
  if (hourNum === 0) {
    return "12:00 AM";
  } else if (hourNum < 12) {
    return `${hourNum}:${minute} AM`;
  } else if (hourNum === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hourNum - 12}:${minute} PM`;
  }
};

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  
  const user = getCurrentUserSync();
  
  if (!isAuthenticatedSync()) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login to View Your Bookings
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your booking history.
          </p>
          <Button onClick={() => navigate("/login")}>Login Now</Button>
        </div>
      </MainLayout>
    );
  }
  
  const userBookings = getUserBookings(user!.id);
  
  const activeBookings = userBookings.filter(
    (booking) => booking.bookingStatus !== "cancelled"
  );
  const pastBookings = userBookings.filter(
    (booking) => booking.bookingStatus === "cancelled"
  );
  
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setBookingDetailsOpen(true);
  };
  
  const handleCancelBooking = (bookingId: string) => {
    const cancelled = cancelBooking(bookingId);
    if (cancelled) {
      toast.success("Booking cancelled successfully");
      setBookingDetailsOpen(false);
    } else {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bookings</h1>
        <p className="text-gray-600">View and manage your ground bookings.</p>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active Bookings ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Bookings ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeBookings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                You don't have any active bookings yet.
              </p>
              <Button onClick={() => navigate("/search")}>
                Find a Ground to Book
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ground</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.groundName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          {format(parseISO(booking.date), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                          {booking.slots.length > 0
                            ? `${formatTime(booking.slots[0].startTime)} - ${formatTime(
                                booking.slots[booking.slots.length - 1].endTime
                              )}`
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.bookingStatus} />
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{booking.totalAmount}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewBookingDetails(booking)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastBookings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-600">You don't have any past bookings.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ground</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.groundName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                          {format(parseISO(booking.date), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                          {booking.slots.length > 0
                            ? `${formatTime(booking.slots[0].startTime)} - ${formatTime(
                                booking.slots[booking.slots.length - 1].endTime
                              )}`
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.bookingStatus} />
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{booking.totalAmount}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewBookingDetails(booking)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 sm:space-x-6">
                <div className="aspect-square w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src="/placeholder.svg"
                    alt={selectedBooking.groundName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedBooking.groundName}</h3>
                  
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Ground Address</span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <BookingStatusBadge status={selectedBooking.bookingStatus} />
                    <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200">
                      {selectedBooking.slots.length} slot(s)
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                    {format(parseISO(selectedBooking.date), "PPP")}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Time Slots</p>
                  {selectedBooking.slots.map((slot) => (
                    <p key={slot.id} className="font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </p>
                  ))}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booked By</p>
                  <p className="font-medium">{selectedBooking.userName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                  <p className="font-medium">{selectedBooking.userPhone}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-primary-700">
                    ₹{selectedBooking.totalAmount}
                  </p>
                </div>
                
                {selectedBooking.bookingStatus !== "cancelled" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </MainLayout>
  );
};

export default Bookings;
