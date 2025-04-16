
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/types/models";

// Get available time slots for a ground on a specific date
export const getAvailableTimeSlots = async (groundId: string, date: string): Promise<TimeSlot[]> => {
  try {
    console.log(`Fetching time slots for ground ${groundId} on date ${date}`);
    
    // First check if there are any time slots for this ground/date
    const { count, error: countError } = await supabase
      .from('time_slots')
      .select('*', { count: 'exact', head: true })
      .eq('ground_id', groundId)
      .eq('date', date);
    
    if (countError) {
      console.error("Error checking time slots:", countError);
      throw countError;
    }
    
    // If no slots exist for this ground/date, create some default slots
    if (!count || count === 0) {
      console.log("No time slots found for this date. Creating default slots...");
      await createDefaultTimeSlots(groundId, date);
    }
    
    // Now fetch all available slots
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
    
    console.log(`Found ${data?.length || 0} available time slots`);
    
    // If no slots were found even after trying to create them,
    // generate mock slots for display purposes only
    if (!data || data.length === 0) {
      return generateMockTimeSlots(groundId, date);
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
    // Return mock time slots as a fallback when there's an error
    return generateMockTimeSlots(groundId, date);
  }
};

// Helper function to create default time slots for a ground/date
export const createDefaultTimeSlots = async (groundId: string, date: string) => {
  try {
    // Create slots from 6 AM to 10 PM with 1-hour duration
    const slots = [];
    const basePrice = 500;
    
    // Morning slots (6 AM - 12 PM)
    for (let hour = 6; hour < 12; hour++) {
      slots.push({
        ground_id: groundId,
        date: date,
        start_time: `${hour}:00`,
        end_time: `${hour + 1}:00`,
        is_booked: false,
        price: basePrice
      });
    }
    
    // Afternoon slots (12 PM - 5 PM)
    for (let hour = 12; hour < 17; hour++) {
      slots.push({
        ground_id: groundId,
        date: date,
        start_time: `${hour}:00`,
        end_time: `${hour + 1}:00`,
        is_booked: false,
        price: basePrice + 100
      });
    }
    
    // Evening slots (5 PM - 10 PM)
    for (let hour = 17; hour < 22; hour++) {
      slots.push({
        ground_id: groundId,
        date: date,
        start_time: `${hour}:00`,
        end_time: `${hour + 1}:00`,
        is_booked: false,
        price: basePrice + 200
      });
    }
    
    // Insert the slots into the database
    const { error } = await supabase.from('time_slots').insert(slots);
    
    if (error) {
      console.error("Error creating default time slots:", error);
      throw error;
    }
    
    console.log(`Created ${slots.length} default time slots for ground ${groundId} on ${date}`);
  } catch (error) {
    console.error("Error in createDefaultTimeSlots:", error);
  }
};

// Generate mock time slots (client-side only) when database operations fail
const generateMockTimeSlots = (groundId: string, date: string): TimeSlot[] => {
  console.log("Generating mock time slots as fallback");
  const slots: TimeSlot[] = [];
  const basePrice = 500;
  
  // Generate mock slots for the entire day
  for (let hour = 6; hour < 22; hour++) {
    const timeSlot: TimeSlot = {
      id: `mock-${groundId}-${date}-${hour}`,
      groundId: groundId,
      date: date,
      startTime: `${hour}:00`,
      endTime: `${hour + 1}:00`,
      isBooked: false,
      price: hour < 12 ? basePrice : hour < 17 ? basePrice + 100 : basePrice + 200
    };
    slots.push(timeSlot);
  }
  
  return slots;
};
