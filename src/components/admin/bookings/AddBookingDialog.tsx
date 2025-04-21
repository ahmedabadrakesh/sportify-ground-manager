
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { Skeleton } from "@/components/ui/skeleton";
import { Ground, TimeSlot } from "@/types/models";
import { getAvailableTimeSlots, createBooking } from "@/services/booking";
import { supabase } from "@/integrations/supabase/client";

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

  // State for games
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);

  useEffect(() => {
    // Fetch available games
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
    setSelectedGames([]); // Reset games when ground changes
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

  // Multi-select handler for games
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
      // Pass selectedGames along, attach as needed. Assuming createBooking supports a games argument (update if not).
      const newBooking = await createBooking(
        selectedGround,
        formattedDate,
        selectedSlots,
        customerName,
        customerPhone,
        currentUserId,
        selectedGames // supply games as an extra argument, if schema needs
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
                  {grounds.map((ground) => (
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
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="games">Select Games</Label>
              {gamesLoading ? (
                <p className="text-sm text-gray-500">Loading games...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {games.map((game) => (
                    <Button
                      key={game.id}
                      type="button"
                      variant={selectedGames.includes(game.id) ? "default" : "outline"}
                      className="text-xs px-3 py-1 rounded-full"
                      onClick={() => handleGameToggle(game.id)}
                    >
                      {game.name}
                    </Button>
                  ))}
                  {games.length === 0 && (
                    <span className="text-xs text-gray-500">No games available</span>
                  )}
                </div>
              )}
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
            loadingSlots ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Loading available time slots...</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <TimeSlotPicker
                slots={availableSlots}
                selectedSlots={selectedSlots}
                onSelectSlot={handleSelectSlot}
              />
            )
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddBooking}
              disabled={
                !selectedGround ||
                !selectedDate ||
                !customerName ||
                !customerPhone ||
                selectedSlots.length === 0 ||
                selectedGames.length === 0
              }
            >
              Create Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
