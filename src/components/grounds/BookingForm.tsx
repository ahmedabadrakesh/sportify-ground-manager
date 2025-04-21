import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Ground, TimeSlot } from "@/types/models";
import TimeSlotSelector from "./TimeSlotSelector";
import BookingDatePicker from "./BookingDatePicker";
import BookingSummary from "./BookingSummary";
import PaymentForm from "./PaymentForm";
import { getAvailableTimeSlots, getSportsAreasForGround } from "@/services/booking/timeSlots";
import { createBooking } from "@/services/booking/createBooking";
import { isAuthenticated } from "@/utils/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BookingGamesPicker from "./BookingGamesPicker";

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
  const [selectedSportsArea, setSelectedSportsArea] = useState<string>("");
  const [sportsAreas, setSportsAreas] = useState<{ id: string; name: string }[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>(
    ground.games && ground.games.length > 0 ? ground.games[0] : ""
  );

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  // Fetch sports areas from the new table
  useEffect(() => {
    const fetchSportsAreas = async () => {
      if (ground.id) {
        const areas = await getSportsAreasForGround(ground.id);
        setSportsAreas(areas);
      }
    };
    fetchSportsAreas();
  }, [ground.id]);

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (formattedDate && ground.id) {
        setLoading(true);
        try {
          console.log("Loading time slots for date:", formattedDate, "ground:", ground.id, "sports area:", selectedSportsArea);
          // Fetch all slots for the ground and date
          const slots = await getAvailableTimeSlots(ground.id, formattedDate);
          console.log("Fetched slots:", slots);
          
          if (slots.length === 0) {
            console.log("No slots returned from server");
            setAvailableSlots([]);
            setLoading(false);
            return;
          }

          // If no sports area is selected yet, show no slots until one is selected
          if (!selectedSportsArea && sportsAreas.length > 0) {
            console.log("No sports area selected yet, waiting for selection");
            setAvailableSlots([]);
            setLoading(false);
            return;
          }
          
          // If a sports area is selected, filter slots for that area
          if (selectedSportsArea) {
            console.log("Filtering slots for sports area:", selectedSportsArea);
            // Include slots that either have no sportsAreaId (general slots) or match the selected area
            const filteredSlots = slots.filter(slot => 
              !slot.sportsAreaId || slot.sportsAreaId === selectedSportsArea
            );
            console.log("Filtered slots:", filteredSlots);
            setAvailableSlots(filteredSlots);
          } else {
            // If no sports areas defined for the ground, show all slots
            console.log("No sports areas defined, showing all slots");
            setAvailableSlots(slots);
          }
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
  }, [formattedDate, ground.id, selectedSportsArea, sportsAreas.length]);

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

    if (sportsAreas.length > 0 && !selectedSportsArea) {
      toast.error("Please select a sports area");
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    try {
      console.log("Creating booking with sports area:", selectedSportsArea);
      const newBooking = await createBooking(
        ground.id,
        formattedDate,
        selectedSlots,
        name,
        phone,
        selectedSportsArea, // pass sport area id
        undefined // userId (will be determined by the service)
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
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Book This Ground</h2>
      <div className="space-y-6">
        {/* Game Picker (Only for ground's available games) */}
        <BookingGamesPicker
          games={ground.games}
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
          required
        />

        <BookingDatePicker date={date} setDate={setDate} />

        {/* SPORTS AREA SELECTOR */}
        {sportsAreas.length > 0 && (
          <div>
            <Label htmlFor="booking-sports-area">Select Sports Area</Label>
            <Select
              value={selectedSportsArea}
              onValueChange={setSelectedSportsArea}
            >
              <SelectTrigger id="booking-sports-area">
                <SelectValue placeholder="Choose Sports Area" />
              </SelectTrigger>
              <SelectContent>
                {sportsAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
          selectedSportsArea={selectedSportsArea}
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
          disabled={selectedSlots.length === 0 || (sportsAreas.length > 0 && !selectedSportsArea)}
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
