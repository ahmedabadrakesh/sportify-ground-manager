
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/models";
import { eventFormSchema, EventFormValues } from "./eventFormSchema";

interface UseEventFormProps {
  mode: "create" | "edit";
  event?: Event;
  onSuccess: () => void;
}

export const useEventForm = ({ mode, event, onSuccess }: UseEventFormProps) => {
  const { createEvent, updateEvent } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format the date value for the form
  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), 'yyyy-MM-dd');
    } catch (e) {
      return dateStr;
    }
  };
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: event?.eventName || "",
      address: event?.address || "",
      city: event?.city || "",
      eventDate: formatDateForInput(event?.eventDate) || "",
      eventTime: event?.eventTime || "",
      registrationUrl: event?.registrationUrl || "",
      sportId: event?.sportId || "",
      image: event?.image || "",
      qrCode: event?.qrCode || ""
    }
  });
  
  const onSubmit = async (values: EventFormValues) => {
    try {
      setIsSubmitting(true);
      if (mode === "create") {
        // Ensure required fields are present for new events
        await createEvent({
          eventName: values.eventName,
          address: values.address,
          city: values.city,
          eventDate: values.eventDate,
          eventTime: values.eventTime,
          registrationUrl: values.registrationUrl || undefined,
          sportId: values.sportId || undefined,
          image: values.image || undefined,
          qrCode: values.qrCode || undefined,
        });
      } else if (mode === "edit" && event) {
        await updateEvent(event.id, values);
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting event form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
};
