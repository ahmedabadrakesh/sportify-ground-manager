
import { supabase } from "@/integrations/supabase/client";
import { Booking, TimeSlot } from "@/types/models";

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
    
    // If no bookings found, return empty array early
    if (!data || data.length === 0) {
      return [];
    }
    
    // Now fetch related data to build complete booking objects
    const bookings: Booking[] = [];
    
    for (const bookingData of data) {
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
    return []; // Return empty array instead of throwing to avoid infinite loops
  }
};
