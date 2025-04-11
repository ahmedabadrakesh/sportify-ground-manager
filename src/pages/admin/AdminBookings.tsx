
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookings, grounds, timeSlots } from "@/data/mockData";
import { cancelBooking, createBooking, getAvailableTimeSlots } from "@/utils/booking";
import { getCurrentUser, hasRole } from "@/utils/auth";
import { toast } from "sonner";
import { Booking, Ground } from "@/types/models";

// Helper function to format time
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

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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
        <Clock className="w-3.5 h-3.5 mr-1" /> Pending
      </Badge>
    );
  }
};

const AdminBookings: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  
  // New booking form state
  const [selectedGround, setSelectedGround] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const currentUser = getCurrentUser();
  const isSuperAdmin = hasRole('super_admin');
  
  // Filter bookings based on user role
  const userBookings = isSuperAdmin
    ? bookings
    : bookings.filter(booking => {
        const ground = grounds.find(g => g.id === booking.groundId);
        return ground?.ownerId === currentUser?.id;
      });
  
  // Filter grounds based on user role
  const userGrounds = isSuperAdmin
    ? grounds
    : grounds.filter(ground => ground.ownerId === currentUser?.id);
  
  const handleGroundChange = (groundId: string) => {
    setSelectedGround(groundId);
    setSelectedSlots([]);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedSlots([]);
    }
  };
  
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };
  
  const handleAddBooking = () => {
    if (!selectedGround || !selectedDate || !customerName || !customerPhone || selectedSlots.length === 0) {
      toast.error("Please fill in all required fields and select at least one slot");
      return;
    }
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const newBooking = createBooking(
      selectedGround,
      formattedDate,
      selectedSlots,
      customerName,
      customerPhone
    );
    
    if (newBooking) {
      toast.success("Booking created successfully");
      setIsAddBookingOpen(false);
      resetForm();
    } else {
      toast.error("Failed to create booking. Please try again.");
    }
  };
  
  const handleCancelBooking = (bookingId: string) => {
    const cancelled = cancelBooking(bookingId);
    if (cancelled) {
      toast.success("Booking cancelled successfully");
      setIsDetailsOpen(false);
    } else {
      toast.error("Failed to cancel booking");
    }
  };
  
  const resetForm = () => {
    setSelectedGround("");
    setSelectedDate(new Date());
    setCustomerName("");
    setCustomerPhone("");
    setSelectedSlots([]);
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
        
        <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Booking</DialogTitle>
              <DialogDescription>
                Create a new booking for a customer directly.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ground">Select Ground</Label>
                  <Select
                    value={selectedGround}
                    onValueChange={handleGroundChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a ground" />
                    </SelectTrigger>
                    <SelectContent>
                      {userGrounds.map((ground) => (
                        <SelectItem key={ground.id} value={ground.id}>
                          {ground.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!selectedGround}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={!selectedGround}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    placeholder="Enter customer phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    disabled={!selectedGround}
                  />
                </div>
              </div>
              
              {selectedGround && selectedDate && (
                <TimeSlotPicker
                  slots={getAvailableTimeSlots(
                    selectedGround,
                    format(selectedDate, "yyyy-MM-dd")
                  )}
                  selectedSlots={selectedSlots}
                  onSelectSlot={handleSelectSlot}
                />
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddBookingOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddBooking}>Create Booking</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Ground</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userBookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                userBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{booking.userName}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3.5 w-3.5 mr-1" />
                          {booking.userPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.groundName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {format(parseISO(booking.date), "dd MMM yyyy")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.slots.length > 0
                            ? `${formatTime(booking.slots[0].startTime)} - ${formatTime(
                                booking.slots[booking.slots.length - 1].endTime
                              )}`
                            : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.bookingStatus} />
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{booking.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailsOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Booking ID
                  </h3>
                  <p className="font-mono text-sm">{selectedBooking.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Booking Date
                  </h3>
                  <p>
                    {format(parseISO(selectedBooking.date), "PPP")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Customer
                  </h3>
                  <p className="font-medium">{selectedBooking.userName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Contact
                  </h3>
                  <p>{selectedBooking.userPhone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Ground
                  </h3>
                  <p>{selectedBooking.groundName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <StatusBadge status={selectedBooking.bookingStatus} />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Booked Slots
                </h3>
                <div className="bg-gray-50 rounded-md p-3 space-y-2">
                  {selectedBooking.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <span className="font-medium">₹{slot.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
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
    </AdminLayout>
  );
};

export default AdminBookings;
