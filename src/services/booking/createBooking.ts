
import { supabase } from "@/integrations/supabase/client";
import { Booking, TimeSlot } from "@/types/models";
import { toast } from "sonner";

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
    // Check if we're dealing with mock slots (client-side only)
    const isMockBooking = slotIds.some(id => id.startsWith('mock-'));
    
    if (isMockBooking) {
      // For mock bookings, create a client-side booking object
      // This will be displayed to the user but not saved to the database
      toast.success("Your booking request has been received. An admin will contact you to confirm.", {
        duration: 5000,
      });
      
      // Create mock slots based on the IDs
      const mockSlots: TimeSlot[] = slotIds.map(id => {
        const parts = id.split('-');
        const hour = parseInt(parts[parts.length - 1]);
        return {
          id,
          groundId,
          date,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isBooked: true,
          price: hour < 12 ? 500 : hour < 17 ? 600 : 700
        };
      });
      
      // Calculate total amount from mock slots
      const totalAmount = mockSlots.reduce((sum, slot) => sum + slot.price, 0);
      
      // Get ground name (if possible)
      let groundName = "Selected Ground";
      try {
        const { data } = await supabase
          .from('grounds')
          .select('name')
          .eq('id', groundId)
          .single();
          
        if (data) {
          groundName = data.name;
        }
      } catch (error) {
        console.error("Error fetching ground name:", error);
      }
      
      // Return a client-side booking object
      return {
        id: `mock-booking-${Date.now()}`,
        userId: userId || '00000000-0000-0000-0000-000000000000',
        userName,
        userPhone,
        groundId,
        groundName,
        date,
        slots: mockSlots,
        totalAmount,
        paymentStatus: 'pending',
        bookingStatus: 'pending',
        createdAt: new Date().toISOString()
      };
    }
    
    // For real bookings, continue with the regular flow
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
