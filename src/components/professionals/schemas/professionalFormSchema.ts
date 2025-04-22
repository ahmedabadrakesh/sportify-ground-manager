
import * as z from "zod";

export const professionalFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession_type: z.string(),
  game_id: z.string(),
  contact_number: z.string(),
  fee: z.string(),
  fee_type: z.string(),
  city: z.string(),
  address: z.string(),
  comments: z.string().optional(),
  photo: z.string().optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
