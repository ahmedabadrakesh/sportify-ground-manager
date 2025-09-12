
import { z } from "zod";

export const eventFormSchema = z.object({
  eventName: z.string().trim().min(1, "Invalid value"),
  address: z.string().trim().min(1, "Invalid value"),
  city: z.string().trim().min(1, "Invalid value"),
  eventDate: z.string().trim().min(1, "Date is required"),
  eventTime: z.string().trim().min(1, "Time is required"),
  registrationUrl: z.string().trim().optional().refine(val => !val || (val.length > 0 && z.string().url().safeParse(val).success), "Invalid URL").or(z.literal("")),
  sportId: z.string().optional().or(z.literal("")),
  image: z.string().trim().optional().refine(val => !val || (val.length > 0 && z.string().url().safeParse(val).success), "Invalid image URL").or(z.literal("")),
  qrCode: z.string().trim().optional().refine(val => !val || (val.length > 0 && z.string().url().safeParse(val).success), "Invalid QR code URL").or(z.literal(""))
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
