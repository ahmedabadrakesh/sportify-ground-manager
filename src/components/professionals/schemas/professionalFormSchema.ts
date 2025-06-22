
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";

// Get the enum types from the database types
type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];
type FeeType = Database["public"]["Enums"]["fee_type"];

export const professionalFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession_type: z.enum(["Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"] as const),
  game_id: z.string().min(1, "Please select a game"),
  contact_number: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  fee: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0),
  fee_type: z.enum(["Per Hour", "Per Day", "Per Match"] as const),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  comments: z.string().optional(),
  photo: z.string().optional(),
  // New fields with proper type handling
  years_of_experience: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  total_match_played: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  awards: z.array(z.string()).optional(),
  accomplishments: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  training_locations: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  punch_line: z.string().optional(),
  instagram_link: z.string().optional(),
  facebook_link: z.string().optional(),
  linkedin_link: z.string().optional(),
  website: z.string().optional(),
  youtube_link: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Professional"]).optional(),
  coaching_availability: z.array(z.enum(["Personal", "Group", "Home", "Out of City"])).optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
