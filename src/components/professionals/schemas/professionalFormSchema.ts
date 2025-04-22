
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";

// Get the enum types from the database types
type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];
type FeeType = Database["public"]["Enums"]["fee_type"];

export const professionalFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession_type: z.string() as z.ZodType<ProfessionType>,
  game_id: z.string(),
  contact_number: z.string(),
  fee: z.string().transform((val) => Number(val)),
  fee_type: z.string() as z.ZodType<FeeType>,
  city: z.string(),
  address: z.string(),
  comments: z.string().optional(),
  photo: z.string().optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
