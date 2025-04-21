
import { supabase } from "@/integrations/supabase/client";
import { Booking, TimeSlot } from "@/types/models";
import { toast } from "sonner";
import { formatTimeSlot } from "@/components/booking/TimeSlotFormatter";

/**
* Update: Accepts an array of game IDs and writes it to booking
*/
export const createBooking = async (
  groundId: string,
  date: string,
  slotIds: string[],
  userName: string,
  userPhone: string,
  userId?: string,
  gameIds?: string[]
): Promise<Booking | null> => {
  try {
    console.log("Creating booking with params:", {
      groundId,
      date,
      slotIds,
      userName,
      userPhone,
      userId,
      gameIds
    });

    // Calculate total amount based on slot prices
    let totalAmount = 0;
    
    // Fetch selected slots to calculate price
    const { data: slotsData, error: slotsError } = await supabase
      .from('time_slots')
      .select('id, price, start_time, end_time')
      .in('id', slotIds);
    
    if (slotsError) {
      console.error("Error fetching slot prices:", slotsError);
      toast.error("Failed to fetch slot prices");
      return null;
    }
    
    totalAmount = slotsData?.reduce((sum, slot) => sum + parseFloat(slot.price.toString()), 0) || 0;
    
    console.log("Total amount calculated:", totalAmount);
    
    // Use a guest ID if userId is not valid UUID; otherwise, use the provided userId
    const effectiveUserId = isValidUUID(userId) ? 
      userId : 
      '00000000-0000-0000-0000-000000000000'; // Guest user ID
    
    console.log("Using effectiveUserId:", effectiveUserId);
    
    // Create booking summary for toast notification
    const timeSlotSummary = slotsData?.length 
      ? `${slotsData.length} slots (${formatTimeSlot(slotsData[0].start_time, slotsData[slotsData.length-1].end_time)})`
      : 'selected slots';
    
    // Insert the booking including game_ids if provided
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: effectiveUserId,
        ground_id: groundId,
        date: date,
        total_amount: totalAmount,
        booking_status: 'pending',
        payment_status: 'pending',
        game_ids: gameIds || []
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      toast.error("Failed to create booking");
      return null;
    }
    
    console.log("Booking created:", bookingData);
    
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
      toast.error("Failed to link time slots");
      return null;
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
      price: slot.price,
      sportsAreaId: slot.sports_area_id || undefined
    }));
    
    const newBooking: Booking = {
      id: bookingData.id,
      userId: effectiveUserId,
      userName: userName,
      userPhone: userPhone,
      groundId: groundId,
      groundName: groundData?.name || 'Unknown Ground',
      date: date,
      slots: slots,
      totalAmount: totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      createdAt: new Date().toISOString(),
      gameIds: gameIds // Include gameIds in the returned booking object
    };
    
    // Show success message with booking details
    toast.success(`Booking created successfully for ${groundData?.name || 'ground'} on ${date}`);
    
    return newBooking;
  } catch (error) {
    console.error("Unexpected error in createBooking:", error);
    toast.error("An unexpected error occurred while creating the booking");
    return null;
  }
};

// Helper function to validate UUID format
function isValidUUID(str?: string): boolean {
  if (!str) return false;
  
  // UUID regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}
