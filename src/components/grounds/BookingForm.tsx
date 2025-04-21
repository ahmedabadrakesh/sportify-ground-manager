
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { getAvailableTimeSlots, createBooking } from "@/utils/booking";
import { isAuthenticated } from "@/utils/auth";
import { toast } from "sonner";
import { Ground, TimeSlot } from "@/types/models";
import { useNavigate } from "react-router-dom";

interface BookingFormProps {
  ground: Ground;
}

const BookingForm: React.FC<BookingFormProps> = ({ ground }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (formattedDate && ground.id) {
        setLoading(true);
        try {
          const slots = await getAvailableTimeSlots(ground.id, formattedDate);
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Error loading time slots:", error);
          toast.error("Failed to load available time slots");
          setAvailableSlots([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadTimeSlots();
  }, [formattedDate, ground.id]);

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleBookNow = async () => {
    if (!isAuthenticated() && (!name || !phone)) {
      toast.error("Please enter your name and phone number");
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    try {
      const newBooking = await createBooking(
        ground.id,
        formattedDate,
        selectedSlots,
        name,
        phone
      );

      if (newBooking) {
        setBookingStep(2);
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An error occurred while creating your booking");
    }
  };

  const handleCompleteBooking = () => {
    toast.success("Booking confirmed! Payment completed successfully.");
    setIsDialogOpen(false);
    setSelectedSlots([]);
    setBookingStep(1);
    navigate("/bookings");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-fit sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Book This Ground</h2>

      {/* Moved the Date Selector to always be visible above slots */}
      <div className="mb-6">
        <Label htmlFor="date" className="block mb-2 text-gray-700 font-medium">
          Select Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal border border-primary-200"
              id="date"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="block mb-2 text-gray-700">
            Available Time Slots
          </Label>
          <div className="text-sm text-gray-500 mb-2 flex items-center">
            <Clock size={14} className="mr-1" />
            <span>
              Each slot is for 1 hour. Select multiple slots if needed.
            </span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">View Available Slots</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {bookingStep === 1
                    ? `Book ${ground.name} - ${date ? format(date, "PPP") : "Select a Date"}`
                    : "Complete Your Booking"}
                </DialogTitle>
              </DialogHeader>

              {bookingStep === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="booking-name">Your Name</Label>
                      <Input
                        id="booking-name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-phone">Phone Number</Label>
                      <Input
                        id="booking-phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Loading available slots...</p>
                    </div>
                  ) : (
                    <TimeSlotPicker
                      slots={availableSlots}
                      selectedSlots={selectedSlots}
                      onSelectSlot={handleSelectSlot}
                    />
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleBookNow}>
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-lg mb-3">Booking Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ground:</span>
                        <span className="font-medium">{ground.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {date ? format(date, "PPP") : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Slots:</span>
                        <span className="font-medium">
                          {selectedSlots.length} slots
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-primary-700">
                          ₹{selectedSlots.length * 800}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-lg mb-3">Payment Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setBookingStep(1)}>
                      Back
                    </Button>
                    <Button onClick={handleCompleteBooking}>
                      Complete Booking
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Price per hour:</span>
            <span className="font-semibold">₹500 - ₹800</span>
          </div>
          <p className="text-xs text-gray-500">
            *Prices may vary based on time slot and day of the week
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
