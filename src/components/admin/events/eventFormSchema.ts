
import { z } from "zod";

export const eventFormSchema = z.object({
  eventName: z.string().trim().min(1, "Event name is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  eventDate: z.string().trim().min(1, "Date is required"),
  eventTime: z.string().trim().min(1, "Time is required"),
  registrationUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  sportId: z.string().optional().or(z.literal("")),
  image: z.string().trim().url("Invalid image URL").optional().or(z.literal("")),
  qrCode: z.string().trim().url("Invalid QR code URL").optional().or(z.literal(""))
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
