
import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ground, TimeSlot } from "@/types/models";
import { getAvailableTimeSlots, createBooking } from "@/services/booking";
import { supabase } from "@/integrations/supabase/client";
import GamesPicker from "./GamesPicker";
import GroundAndDatePickerSection from "./GroundAndDatePickerSection";
import CustomerDetailsSection from "./CustomerDetailsSection";
import TimeSlotSection from "./TimeSlotSection";
import BookingActionsFooter from "./BookingActionsFooter";

interface AddBookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  grounds: Ground[];
  onBookingCreated: () => void;
  currentUserId?: string;
}

interface Game {
  id: string;
  name: string;
}

const AddBookingDialog: React.FC<AddBookingDialogProps> = ({
  isOpen,
  onOpenChange,
  grounds,
  onBookingCreated,
  currentUserId
}) => {
  const [selectedGround, setSelectedGround] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      setGamesLoading(true);
      const { data, error } = await supabase.from("games").select("id, name").order("name", { ascending: true });
      if (!error && data) {
        setGames(data);
      } else {
        setGames([]);
      }
      setGamesLoading(false);
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedGround && selectedDate) {
        setLoadingSlots(true);
        try {
          const formattedDate = format(selectedDate, "yyyy-MM-dd");
          const slots = await getAvailableTimeSlots(selectedGround, formattedDate);
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Error fetching time slots:", error);
        } finally {
          setLoadingSlots(false);
        }
      }
    };
    fetchTimeSlots();
  }, [selectedGround, selectedDate]);

  const handleGroundChange = (groundId: string) => {
    setSelectedGround(groundId);
    setSelectedSlots([]);
    setSelectedGames([]);
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

  const handleGameToggle = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleAddBooking = async () => {
    if (!selectedGround || !selectedDate || !customerName || !customerPhone || selectedSlots.length === 0 || selectedGames.length === 0) {
      return;
    }
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    
    try {
      const newBooking = await createBooking(
        selectedGround,
        formattedDate,
        selectedSlots,
        customerName,
        customerPhone,
        currentUserId,
        selectedGames
      );
      
      if (newBooking) {
        onBookingCreated();
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const resetForm = () => {
    setSelectedGround("");
    setSelectedDate(new Date());
    setCustomerName("");
    setCustomerPhone("");
    setSelectedSlots([]);
    setSelectedGames([]);
  };

  const availableGameIds: string[] = useMemo(() => {
    if (!selectedGround) return [];
    const ground = grounds.find(g => g.id === selectedGround);
    if (!ground || !Array.isArray(ground.games)) return [];
    return ground.games as string[];
  }, [selectedGround, grounds]);

  const shownGames: Game[] = useMemo(() => {
    if (!availableGameIds.length) return [];
    return games.filter(game => availableGameIds.includes(game.id));
  }, [games, availableGameIds]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            Create a new booking for a customer directly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GroundAndDatePickerSection
              grounds={grounds}
              selectedGround={selectedGround}
              handleGroundChange={handleGroundChange}
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
            />
            <div className="space-y-2 col-span-1 md:col-span-2">
              <GamesPicker
                games={shownGames}
                selectedGames={selectedGames}
                onToggle={handleGameToggle}
                loading={gamesLoading}
              />
            </div>
            <CustomerDetailsSection
              customerName={customerName}
              customerPhone={customerPhone}
              setCustomerName={setCustomerName}
              setCustomerPhone={setCustomerPhone}
              disabled={!selectedGround}
            />
          </div>
          <TimeSlotSection
            loadingSlots={loadingSlots}
            availableSlots={availableSlots}
            selectedSlots={selectedSlots}
            onSelectSlot={handleSelectSlot}
            show={!!selectedGround && !!selectedDate}
          />
          <BookingActionsFooter
            onCancel={() => {
              onOpenChange(false);
              resetForm();
            }}
            onCreate={handleAddBooking}
            canCreate={
              !!selectedGround &&
              !!selectedDate &&
              !!customerName &&
              !!customerPhone &&
              selectedSlots.length > 0 &&
              selectedGames.length > 0
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
