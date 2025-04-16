
import React from "react";
import { format } from "date-fns";
import { Calendar, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/models";
import { StatusBadge } from "./StatusBadge";

interface BookingsTableProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
}

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

const renderTimeSlotInfo = (booking: Booking) => {
  if (!booking.slots || booking.slots.length === 0) {
    return "No time slots available";
  }
  
  const firstSlot = booking.slots[0];
  const lastSlot = booking.slots[booking.slots.length - 1];
  
  if (!firstSlot || !lastSlot) {
    return "Time information unavailable";
  }
  
  return `${formatTime(firstSlot.startTime)} - ${formatTime(lastSlot.endTime)}`;
};

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, onViewDetails }) => {
  return (
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
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
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
                        {format(new Date(booking.date), "dd MMM yyyy")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {renderTimeSlotInfo(booking)}
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
                      onClick={() => onViewDetails(booking)}
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
  );
};

export default BookingsTable;
