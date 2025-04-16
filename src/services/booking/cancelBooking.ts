
import { supabase } from "@/integrations/supabase/client";

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
