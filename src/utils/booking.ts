import { Booking, Ground, TimeSlot } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserSync } from "./auth";
import { useInventoryItems } from "./inventory";
import { toast } from "sonner";

// Generate unique ID for bookings
const generateId = () => `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Get available grounds
export const getAvailableGrounds = async (
  game?: string,
  date?: string,
  location?: { lat: number; lng: number; radius: number }
): Promise<Ground[]> => {
  try {
    let query = supabase
      .from('grounds')
      .select(`
        id,
        name,
        description,
        address,
        location,
        owner_id,
        games,
        facilities,
        images,
        rating,
        review_count,
        users(name, phone, whatsapp)
      `);
    
    // Filter by game
    if (game) {
      // Using containedBy for array search
      query = query.contains('games', [game]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching available grounds:", error);
      throw error;
    }
    
    let grounds = data.map(ground => {
      // Handle location type safely
      let locationObj = { lat: 0, lng: 0 };
      if (ground.location) {
        try {
          // If location is a string, try to parse it
          if (typeof ground.location === 'string') {
            const parsedLocation = JSON.parse(ground.location);
            locationObj = {
              lat: Number(parsedLocation.lat) || 0,
              lng: Number(parsedLocation.lng) || 0
            };
          } 
          // If location is an object, use it directly
          else if (typeof ground.location === 'object') {
            const locObj = ground.location as any;
            locationObj = {
              lat: Number(locObj.lat) || 0,
              lng: Number(locObj.lng) || 0
            };
          }
        } catch (e) {
          console.error("Error parsing location:", e);
        }
      }
      
      return {
        id: ground.id,
        name: ground.name,
        description: ground.description || '',
        address: ground.address,
        location: locationObj,
        ownerId: ground.owner_id,
        ownerName: ground.users ? ground.users.name : 'Unknown Owner',
        ownerContact: ground.users ? ground.users.phone || '' : '',
        ownerWhatsapp: ground.users ? ground.users.whatsapp || '' : '',
        games: ground.games || [],
        facilities: ground.facilities || [],
        images: ground.images || [],
        rating: ground.rating || 0,
        reviewCount: ground.review_count || 0
      };
    });
    
    // Filter by location (if provided) - this would ideally be done in the database
    // but we're implementing it in JS for simplicity
    if (location) {
      grounds = grounds.filter(ground => {
        // Simple distance calculation (this is a simplification)
        const distance = Math.sqrt(
          Math.pow(ground.location.lat - location.lat, 2) + 
          Math.pow(ground.location.lng - location.lng, 2)
        );
        return distance <= location.radius;
      });
    }
    
    return grounds;
  } catch (error) {
    console.error("Error in getAvailableGrounds:", error);
    toast.error("Failed to load grounds");
    return [];
  }
};

// Get available time slots for a ground on a specific date
export const getAvailableTimeSlots = async (groundId: string, date: string): Promise<TimeSlot[]> => {
  try {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('ground_id', groundId)
      .eq('date', date)
      .eq('is_booked', false);
    
    if (error) {
      console.error("Error fetching time slots:", error);
      throw error;
    }
    
    return data.map(slot => ({
      id: slot.id,
      groundId: slot.ground_id,
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      price: slot.price,
      isBooked: slot.is_booked
    }));
  } catch (error) {
    console.error("Error in getAvailableTimeSlots:", error);
    toast.error("Failed to load time slots");
    return [];
  }
};

// Create a new booking
export const createBooking = async (
  groundId: string,
  date: string,
  slotIds: string[],
  userName: string,
  userPhone: string,
  sportsAreaId?: string
): Promise<Booking | null> => {
  try {
    const user = getCurrentUserSync();
    if (!user && !userName) return null;
    
    // Get the ground info
    const { data: groundData, error: groundError } = await supabase
      .from('grounds')
      .select('name')
      .eq('id', groundId)
      .single();
    
    if (groundError) {
      console.error(`Ground with ID ${groundId} not found:`, groundError);
      return null;
    }
    
    // Get the selected time slots
    const { data: slotsData, error: slotsError } = await supabase
      .from('time_slots')
      .select('*')
      .in('id', slotIds)
      .eq('ground_id', groundId)
      .eq('date', date)
      .eq('is_booked', false);
    
    if (slotsError || !slotsData || slotsData.length !== slotIds.length) {
      console.error("Error fetching slots or some slots unavailable:", slotsError);
      return null;
    }
    
    // Calculate total amount
    const totalAmount = slotsData.reduce((sum, slot) => sum + slot.price, 0);
    
    // Begin a transaction to create booking and update slots
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user?.id || 'guest',
        ground_id: groundId,
        date,
        total_amount: totalAmount,
        booking_status: 'pending',
        payment_status: 'pending',
        sports_area_id: sportsAreaId || null
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      return null;
    }
    
    // Link the slots to the booking
    const bookingSlots = slotIds.map(slotId => ({
      booking_id: bookingData.id,
      slot_id: slotId
    }));
    
    const { error: linkError } = await supabase
      .from('booking_slots')
      .insert(bookingSlots);
    
    if (linkError) {
      console.error("Error linking slots to booking:", linkError);
      return null;
    }
    
    // Mark the slots as booked and assign sports_area_id
    for (const slotId of slotIds) {
      const { error: updateError } = await supabase
        .from('time_slots')
        .update({ is_booked: true, sports_area_id: sportsAreaId || null })
        .eq('id', slotId);
      if (updateError) {
        console.error(`Error updating slot ${slotId} as booked:`, updateError);
      }
    }
    
    // Format the slots for the return data
    const slots = slotsData.map(slot => ({
      id: slot.id,
      groundId: slot.ground_id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      date: slot.date,
      isBooked: true,
      price: slot.price,
      sportsAreaId: slot.sports_area_id || undefined,
    }));
    
    // Create the booking object to return
    const newBooking: Booking = {
      id: bookingData.id,
      userId: user?.id || 'guest',
      userName: user?.name || userName,
      userPhone: user?.phone || userPhone,
      groundId,
      groundName: groundData.name,
      date,
      slots,
      totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      createdAt: bookingData.created_at,
      sportsAreaId: sportsAreaId
    };
    
    return newBooking;
  } catch (error) {
    console.error("Error in createBooking:", error);
    toast.error("Failed to create booking");
    return null;
  }
};

// Get bookings for a user
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    // First get the basic booking data
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id, 
        user_id,
        ground_id,
        date,
        total_amount,
        booking_status,
        payment_status,
        created_at,
        grounds(name)
      `)
      .eq('user_id', userId);
    
    if (bookingsError) {
      console.error("Error fetching user bookings:", bookingsError);
      return [];
    }
    
    // For each booking, get the linked slots
    const bookings: Booking[] = [];
    
    for (const booking of bookingsData) {
      // Get slots for this booking
      const { data: slotLinks, error: linkError } = await supabase
        .from('booking_slots')
        .select('slot_id')
        .eq('booking_id', booking.id);
        
      if (linkError) {
        console.error(`Error fetching slots for booking ${booking.id}:`, linkError);
        continue;
      }
      
      let slots: TimeSlot[] = [];
      
      if (slotLinks && slotLinks.length > 0) {
        const slotIds = slotLinks.map(link => link.slot_id);
        
        const { data: slotsData, error: slotsError } = await supabase
          .from('time_slots')
          .select('*')
          .in('id', slotIds);
          
        if (!slotsError && slotsData) {
          slots = slotsData.map(slot => ({
            id: slot.id,
            groundId: slot.ground_id,
            startTime: slot.start_time,
            endTime: slot.end_time,
            date: slot.date,
            isBooked: true,
            price: slot.price
          }));
        }
      }
      
      bookings.push({
        id: booking.id,
        userId: booking.user_id,
        groundId: booking.ground_id,
        groundName: booking.grounds?.name || 'Unknown Ground',
        date: booking.date,
        totalAmount: booking.total_amount,
        bookingStatus: booking.booking_status,
        paymentStatus: booking.payment_status,
        createdAt: booking.created_at,
        slots
      });
    }
    
    return bookings;
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    toast.error("Failed to load bookings");
    return [];
  }
};

// Get bookings for a ground
export const getGroundBookings = async (groundId: string): Promise<Booking[]> => {
  try {
    // First get the basic booking data
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id, 
        user_id,
        ground_id,
        date,
        total_amount,
        booking_status,
        payment_status,
        created_at,
        users(name, phone)
      `)
      .eq('ground_id', groundId);
    
    if (bookingsError) {
      console.error("Error fetching ground bookings:", bookingsError);
      return [];
    }
    
    // For each booking, get the linked slots
    const bookings: Booking[] = [];
    
    for (const booking of bookingsData) {
      // Get slots for this booking
      const { data: slotLinks, error: linkError } = await supabase
        .from('booking_slots')
        .select('slot_id')
        .eq('booking_id', booking.id);
        
      if (linkError) {
        console.error(`Error fetching slots for booking ${booking.id}:`, linkError);
        continue;
      }
      
      let slots: TimeSlot[] = [];
      
      if (slotLinks && slotLinks.length > 0) {
        const slotIds = slotLinks.map(link => link.slot_id);
        
        const { data: slotsData, error: slotsError } = await supabase
          .from('time_slots')
          .select('*')
          .in('id', slotIds);
          
        if (!slotsError && slotsData) {
          slots = slotsData.map(slot => ({
            id: slot.id,
            groundId: slot.ground_id,
            startTime: slot.start_time,
            endTime: slot.end_time,
            date: slot.date,
            isBooked: true,
            price: slot.price
          }));
        }
      }
      
      bookings.push({
        id: booking.id,
        userId: booking.user_id,
        userName: booking.users?.name || 'Unknown User',
        userPhone: booking.users?.phone || '',
        groundId: booking.ground_id,
        date: booking.date,
        totalAmount: booking.total_amount,
        bookingStatus: booking.booking_status,
        paymentStatus: booking.payment_status,
        createdAt: booking.created_at,
        slots
      });
    }
    
    return bookings;
  } catch (error) {
    console.error("Error in getGroundBookings:", error);
    toast.error("Failed to load bookings");
    return [];
  }
};

// Complete payment for a booking
export const completePayment = async (bookingId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        booking_status: 'confirmed'
      })
      .eq('id', bookingId);
    
    if (error) {
      console.error(`Error updating payment for booking ${bookingId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in completePayment:", error);
    return false;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    // Get the slots linked to this booking
    const { data: slotLinks, error: linkError } = await supabase
      .from('booking_slots')
      .select('slot_id')
      .eq('booking_id', bookingId);
      
    if (linkError) {
      console.error("Error fetching slots for cancellation:", linkError);
      return false;
    }
    
    if (slotLinks && slotLinks.length > 0) {
      const slotIds = slotLinks.map(link => link.slot_id);
      
      // Mark the slots as not booked
      const { error: updateError } = await supabase
        .from('time_slots')
        .update({ is_booked: false })
        .in('id', slotIds);
      
      if (updateError) {
        console.error("Error unmarking slots as booked:", updateError);
      }
    }
    
    // Update the booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'cancelled',
        booking_status: 'cancelled'
      })
      .eq('id', bookingId);
    
    if (bookingError) {
      console.error("Error updating booking status:", bookingError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    return false;
  }
};
