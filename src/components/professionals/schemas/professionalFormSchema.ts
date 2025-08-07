
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";

// Get the enum types from the database types
type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];
type FeeType = Database["public"]["Enums"]["fee_type"];

export const professionalFormSchema = z.object({
  // Basic Info
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession_type: z.enum(["Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"] as const),
  photo: z.string().optional(),
  academy_name: z.string().optional(),
  years_of_experience: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  game_id: z.string().min(1, "Please select a game"),
  is_certified: z.boolean().optional(),
  
  // Contact & Social Details
  contact_number: z.string().min(1, "Contact number is required"),
  whatsapp: z.string().optional(),
  whatsapp_same_as_phone: z.boolean().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  instagram_link: z.string().optional(),
  youtube_link: z.string().optional(),
  linkedin_link: z.string().optional(),
  website: z.string().optional(),
  facebook_link: z.string().optional(),
  
  // Professional Details
  district_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  state_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  national_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  international_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  specialties: z.array(z.string()).optional(),
  games_played: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  accomplishments: z.array(z.string()).optional(),
  training_locations_detailed: z.array(z.object({
    location: z.string(),
    address: z.string(),
    timings: z.string()
  })).optional(),
  
  // Media & Pricing
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  one_on_one_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  group_session_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  online_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  free_demo_call: z.boolean().optional(),
  
  // About Me
  about_me: z.string().optional(),
  success_stories: z.array(z.object({
    client_name: z.string(),
    age: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0),
    story_details: z.string()
  })).optional(),
  
  // Legacy fields for backward compatibility
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  comments: z.string().optional(),
  fee: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0),
  fee_type: z.enum(["Per Hour", "Per Day", "Per Match"] as const),
  total_match_played: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  awards: z.array(z.string()).optional(),
  training_locations: z.array(z.string()).optional(),
  punch_line: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Professional"]).optional(),
  coaching_availability: z.array(z.enum(["Personal", "Group", "Home", "Out of City"])).optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
