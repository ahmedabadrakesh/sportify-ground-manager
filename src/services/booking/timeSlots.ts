
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
      .eq('is_booked', false)
      .order('start_time', { ascending: true });
    
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
      price: slot.price,
      sportsAreaId: slot.sports_area_id
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
    // Create slots from 12 AM to 12 PM with 1-hour duration
    const slots = [];
    const basePrice = 500;
    
    // Get the sports areas for this ground
    const { data: groundData } = await supabase
      .from('grounds')
      .select('sports_areas')
      .eq('id', groundId)
      .single();
    
    // Extract sports area IDs if available
    const sportsAreas = groundData?.sports_areas || [];
    let firstSportsAreaId = null;
    if (Array.isArray(sportsAreas) && sportsAreas.length > 0) {
      // Try to get the ID from the first sports area
      const firstArea = sportsAreas[0];
      if (typeof firstArea === 'object' && firstArea !== null) {
        firstSportsAreaId = firstArea.id || null;
      }
    }
    
    console.log(`Creating default slots with sports area: ${firstSportsAreaId}`);
    
    // All 24 hours of the day
    for (let hour = 0; hour < 24; hour++) {
      const formattedStartHour = hour.toString().padStart(2, '0');
      const formattedEndHour = ((hour + 1) % 24).toString().padStart(2, '0');
      
      // Set different prices for different times of day
      let price = basePrice;
      if (hour >= 6 && hour < 12) {
        price = basePrice; // Morning slots
      } else if (hour >= 12 && hour < 17) {
        price = basePrice + 100; // Afternoon slots
      } else if (hour >= 17 && hour < 22) {
        price = basePrice + 200; // Evening slots
      } else {
        price = basePrice - 100; // Night slots (discounted)
      }
      
      slots.push({
        ground_id: groundId,
        date: date,
        start_time: `${formattedStartHour}:00`,
        end_time: `${formattedEndHour}:00`,
        is_booked: false,
        price: price,
        sports_area_id: firstSportsAreaId
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
  
  // Generate mock slots for all 24 hours
  for (let hour = 0; hour < 24; hour++) {
    const formattedStartHour = hour.toString().padStart(2, '0');
    const formattedEndHour = ((hour + 1) % 24).toString().padStart(2, '0');
    
    // Set different prices for different times of day
    let price = basePrice;
    if (hour >= 6 && hour < 12) {
      price = basePrice; // Morning slots
    } else if (hour >= 12 && hour < 17) {
      price = basePrice + 100; // Afternoon slots
    } else if (hour >= 17 && hour < 22) {
      price = basePrice + 200; // Evening slots
    } else {
      price = basePrice - 100; // Night slots (discounted)
    }
    
    const timeSlot: TimeSlot = {
      id: `mock-${groundId}-${date}-${hour}`,
      groundId: groundId,
      date: date,
      startTime: `${formattedStartHour}:00`,
      endTime: `${formattedEndHour}:00`,
      isBooked: false,
      price: price,
      sportsAreaId: undefined
    };
    slots.push(timeSlot);
  }
  
  return slots;
};
