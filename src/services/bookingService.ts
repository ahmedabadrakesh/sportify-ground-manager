
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Booking, Ground, TimeSlot } from "@/types/models";
import { format } from "date-fns";

// Fetch all bookings with optional filtering
export const fetchBookings = async (options?: { groundId?: string, userId?: string }) => {
  try {
    console.log("Fetching bookings from database...");
    
    let query = supabase.from('bookings').select(`
      id,
      booking_status,
      payment_status,
      date,
      total_amount,
      ground_id,
      user_id,
      created_at,
      updated_at
    `);
    
    // Apply filters if provided
    if (options?.groundId) {
      query = query.eq('ground_id', options.groundId);
    }
    
    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
    
    console.log("Booking data fetched:", data);
    
    // Now fetch related data to build complete booking objects
    const bookings: Booking[] = [];
    
    for (const bookingData of data || []) {
      try {
        // Get ground details
        const { data: groundData } = await supabase
          .from('grounds')
          .select('id, name')
          .eq('id', bookingData.ground_id)
          .single();
        
        // Get time slots for this booking
        const { data: slotJoinData } = await supabase
          .from('booking_slots')
          .select('slot_id')
          .eq('booking_id', bookingData.id);
        
        let slots: TimeSlot[] = [];
        if (slotJoinData && slotJoinData.length > 0) {
          // Get all slot details
          const slotIds = slotJoinData.map(join => join.slot_id);
          const { data: slotsData } = await supabase
            .from('time_slots')
            .select('*')
            .in('id', slotIds);
          
          if (slotsData) {
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
        
        // Get user details (name and phone)
        const { data: userData } = await supabase
          .from('users')
          .select('name, phone')
          .eq('id', bookingData.user_id)
          .single();
        
        bookings.push({
          id: bookingData.id,
          userId: bookingData.user_id,
          userName: userData?.name || 'Unknown User',
          userPhone: userData?.phone || 'No phone',
          groundId: bookingData.ground_id,
          groundName: groundData?.name || 'Unknown Ground',
          date: bookingData.date,
          slots: slots,
          totalAmount: bookingData.total_amount,
          paymentStatus: bookingData.payment_status as 'pending' | 'completed' | 'cancelled',
          bookingStatus: bookingData.booking_status as 'confirmed' | 'pending' | 'cancelled',
          createdAt: bookingData.created_at
        });
      } catch (err) {
        console.error("Error processing booking:", err);
        // Continue with other bookings
      }
    }
    
    return bookings;
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    throw error;
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
    
    return (data || []).map(slot => ({
      id: slot.id,
      groundId: slot.ground_id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      date: slot.date,
      isBooked: slot.is_booked,
      price: slot.price
    }));
  } catch (error) {
    console.error("Error in getAvailableTimeSlots:", error);
    return [];
  }
};

// Create a booking
export const createBooking = async (
  groundId: string,
  date: string,
  slotIds: string[],
  userName: string,
  userPhone: string,
  userId?: string
): Promise<Booking | null> => {
  try {
    // Calculate total amount based on slot prices
    let totalAmount = 0;
    
    // Get all selected slots to calculate price
    const { data: slotsData, error: slotsError } = await supabase
      .from('time_slots')
      .select('id, price')
      .in('id', slotIds);
    
    if (slotsError) {
      console.error("Error fetching slot prices:", slotsError);
      throw slotsError;
    }
    
    totalAmount = slotsData?.reduce((sum, slot) => sum + parseFloat(slot.price.toString()), 0) || 0;
    
    // Insert the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId || '00000000-0000-0000-0000-000000000000', // Guest ID placeholder
        ground_id: groundId,
        date: date,
        total_amount: totalAmount,
        booking_status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      throw bookingError;
    }
    
    // Link the slots to the booking
    const bookingSlots = slotIds.map(slotId => ({
      booking_id: bookingData.id,
      slot_id: slotId
    }));
    
    const { error: joinError } = await supabase
      .from('booking_slots')
      .insert(bookingSlots);
    
    if (joinError) {
      console.error("Error linking slots to booking:", joinError);
      throw joinError;
    }
    
    // Mark the slots as booked
    for (const slotId of slotIds) {
      const { error: updateError } = await supabase
        .from('time_slots')
        .update({ is_booked: true })
        .eq('id', slotId);
      
      if (updateError) {
        console.error(`Error marking slot ${slotId} as booked:`, updateError);
      }
    }
    
    // Get ground details
    const { data: groundData } = await supabase
      .from('grounds')
      .select('name')
      .eq('id', groundId)
      .single();
    
    // Get time slots for this booking
    const { data: slotData } = await supabase
      .from('time_slots')
      .select('*')
      .in('id', slotIds);
    
    const slots: TimeSlot[] = (slotData || []).map(slot => ({
      id: slot.id,
      groundId: slot.ground_id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      date: slot.date,
      isBooked: true,
      price: slot.price
    }));
    
    const newBooking: Booking = {
      id: bookingData.id,
      userId: userId || '00000000-0000-0000-0000-000000000000',
      userName: userName,
      userPhone: userPhone,
      groundId: groundId,
      groundName: groundData?.name || 'Unknown Ground',
      date: date,
      slots: slots,
      totalAmount: totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    return newBooking;
  } catch (error) {
    console.error("Error in createBooking:", error);
    return null;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    // Get the slots associated with this booking
    const { data: slotJoinData, error: joinError } = await supabase
      .from('booking_slots')
      .select('slot_id')
      .eq('booking_id', bookingId);
    
    if (joinError) {
      console.error("Error fetching booking slots:", joinError);
      throw joinError;
    }
    
    // Mark the booking as cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        booking_status: 'cancelled',
        payment_status: 'cancelled'
      })
      .eq('id', bookingId);
    
    if (updateError) {
      console.error("Error updating booking status:", updateError);
      throw updateError;
    }
    
    // Free up the reserved time slots
    if (slotJoinData && slotJoinData.length > 0) {
      const slotIds = slotJoinData.map(join => join.slot_id);
      
      for (const slotId of slotIds) {
        const { error: slotError } = await supabase
          .from('time_slots')
          .update({ is_booked: false })
          .eq('id', slotId);
        
        if (slotError) {
          console.error(`Error updating slot ${slotId}:`, slotError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    return false;
  }
};
