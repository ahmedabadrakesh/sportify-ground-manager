
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Ground, TimeSlot } from "@/types/models";
import TimeSlotSelector from "./TimeSlotSelector";
import BookingDatePicker from "./BookingDatePicker";
import BookingSummary from "./BookingSummary";
import PaymentForm from "./PaymentForm";
import { getAvailableTimeSlots } from "@/services/booking/timeSlots";
import { createBooking } from "@/utils/booking";
import { isAuthenticated } from "@/utils/auth";
import { toast } from "sonner";
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
          console.log("Loaded slots:", slots);
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
    setSelectedSlots([]);
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
        setIsDialogOpen(true);
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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Book This Ground</h2>

      <div className="space-y-6">
        <BookingDatePicker date={date} setDate={setDate} />

        {!isAuthenticated() && (
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
        )}

        <TimeSlotSelector
          loading={loading}
          availableSlots={availableSlots}
          selectedSlots={selectedSlots}
          onSelectSlot={handleSelectSlot}
        />

        {selectedSlots.length > 0 && (
          <BookingSummary
            ground={ground}
            date={date}
            selectedSlots={selectedSlots.length}
            totalAmount={selectedSlots.reduce((total, slotId) => {
              const slot = availableSlots.find(s => s.id === slotId);
              return total + (slot?.price || 0);
            }, 0)}
          />
        )}

        <Button
          className="w-full"
          disabled={selectedSlots.length === 0}
          onClick={handleBookNow}
        >
          Proceed to Payment
        </Button>

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

      {/* Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Please complete your payment to confirm booking
            </DialogDescription>
          </DialogHeader>
          <PaymentForm onCompleteBooking={handleCompleteBooking} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingForm;
