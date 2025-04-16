
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/types/models";

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
