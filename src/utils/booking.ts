
import { Booking, Ground, TimeSlot, User } from "@/types/models";
import { bookings, grounds, timeSlots } from "@/data/mockData";
import { getCurrentUser } from "./auth";
import { useInventoryItems } from "./inventory";

// Generate unique ID
const generateId = () => `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Get available grounds
export const getAvailableGrounds = (
  game?: string,
  date?: string,
  location?: { lat: number; lng: number; radius: number }
): Ground[] => {
  let filteredGrounds = [...grounds];
  
  // Filter by game
  if (game) {
    filteredGrounds = filteredGrounds.filter(ground => 
      ground.games.some(g => g.toLowerCase().includes(game.toLowerCase()))
    );
  }
  
  // Filter by location (if provided)
  if (location) {
    filteredGrounds = filteredGrounds.filter(ground => {
      // Simple distance calculation (this is a simplification)
      const distance = Math.sqrt(
        Math.pow(ground.location.lat - location.lat, 2) + 
        Math.pow(ground.location.lng - location.lng, 2)
      );
      return distance <= location.radius;
    });
  }
  
  return filteredGrounds;
};

// Get available time slots for a ground on a specific date
export const getAvailableTimeSlots = (groundId: string, date: string): TimeSlot[] => {
  return timeSlots.filter(
    slot => slot.groundId === groundId && slot.date === date && !slot.isBooked
  );
};

// Create a new booking
export const createBooking = (
  groundId: string,
  date: string,
  slotIds: string[],
  userName: string,
  userPhone: string
): Booking | null => {
  const user = getCurrentUser();
  if (!user && !userName) return null;
  
  const ground = grounds.find(g => g.id === groundId);
  if (!ground) {
    console.error(`Ground with ID ${groundId} not found`);
    return null;
  }
  
  // Get the selected time slots
  const selectedSlots = timeSlots.filter(
    slot => slotIds.includes(slot.id) && slot.groundId === groundId && slot.date === date && !slot.isBooked
  );
  
  if (selectedSlots.length !== slotIds.length) {
    console.log("Some slots are not available for booking");
    return null; // Some slots are not available
  }
  
  // Calculate total amount
  const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  
  // Mark slots as booked
  selectedSlots.forEach(slot => {
    const index = timeSlots.findIndex(s => s.id === slot.id);
    if (index !== -1) {
      timeSlots[index] = { ...timeSlots[index], isBooked: true };
    }
  });
  
  // Use some inventory items for each booked slot (if needed)
  const inventoryUsed = useInventoryItems(groundId, "item-1", 1); // Example inventory usage
  console.log("Inventory used:", inventoryUsed);
  
  // Create new booking object
  const newBooking: Booking = {
    id: generateId(),
    userId: user?.id || 'guest',
    userName: user?.name || userName,
    userPhone: user?.phone || userPhone,
    groundId: ground.id,
    groundName: ground.name,
    date,
    slots: selectedSlots,
    totalAmount,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  // Add to bookings
  bookings.push(newBooking);
  console.log("New booking created:", newBooking);
  
  return newBooking;
};

// Get bookings for a user
export const getUserBookings = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

// Get bookings for a ground
export const getGroundBookings = (groundId: string): Booking[] => {
  return bookings.filter(booking => booking.groundId === groundId);
};

// Complete payment for a booking
export const completePayment = (bookingId: string): boolean => {
  const index = bookings.findIndex(booking => booking.id === bookingId);
  if (index === -1) {
    console.error(`Booking with ID ${bookingId} not found`);
    return false;
  }
  
  bookings[index] = {
    ...bookings[index],
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
  };
  
  return true;
};

// Cancel a booking
export const cancelBooking = (bookingId: string): boolean => {
  const index = bookings.findIndex(booking => booking.id === bookingId);
  if (index === -1) {
    console.error(`Booking with ID ${bookingId} not found`);
    return false;
  }
  
  // Unmark slots as booked
  bookings[index].slots.forEach(slot => {
    const slotIndex = timeSlots.findIndex(s => s.id === slot.id);
    if (slotIndex !== -1) {
      timeSlots[slotIndex] = { ...timeSlots[slotIndex], isBooked: false };
    }
  });
  
  bookings[index] = {
    ...bookings[index],
    paymentStatus: 'cancelled',
    bookingStatus: 'cancelled',
  };
  
  console.log("Booking cancelled:", bookings[index]);
  return true;
};
