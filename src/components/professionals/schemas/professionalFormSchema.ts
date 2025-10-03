
import * as z from "zod";

export const professionalFormSchema = z.object({
  // Basic Info
  name: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Name must be at least 2 characters"),
  age: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  sex: z.enum(["Male", "Female"] as const).optional(),
  profession_type: z.array(z.enum(["Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"] as const)).min(1, "At least one profession type is required"),
  photo: z.string().optional(),
  academy_name: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  years_of_experience: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  games_played: z.array(z.string()).min(1, "At least one game is required"),
  is_certified: z.boolean().optional(),
  number_of_clients_served: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  
  // Contact & Social Details
  contact_number: z.string().trim().min(1, "Invalid value"),
  whatsapp: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  whatsapp_same_as_phone: z.boolean().optional(),
  email: z.string().trim().min(1, "Invalid value").email("Invalid email format"),
  instagram_link: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  youtube_link: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  linkedin_link: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  website: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  facebook_link: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  
  // Location coordinates
  address_lat: z.number().optional(),
  address_lng: z.number().optional(),
  address_place_id: z.string().optional(),
  city_lat: z.number().optional(),
  city_lng: z.number().optional(),
  city_place_id: z.string().optional(),
  
  // Professional Details
  district_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  state_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  national_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  international_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  specialties: z.array(z.string().trim().min(1, "Invalid value")).optional(),
  certifications: z.array(z.string().trim().min(1, "Invalid value")).optional(),
  education: z.array(z.string().trim().min(1, "Invalid value")).optional(),
  accomplishments: z.array(z.string().trim().min(1, "Invalid value")).optional(),
  training_locations_detailed: z.array(z.object({
    location: z.string().trim().min(1, "Invalid value"),
    address: z.string().trim().min(1, "Invalid value"),
    timings: z.string().trim().min(1, "Invalid value"),
    lat: z.number().optional(),
    lng: z.number().optional(),
    place_id: z.string().optional()
  })).optional(),
  
  // Media & Pricing
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  one_on_one_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  group_session_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  online_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  free_demo_call: z.boolean().optional(),
  
  // About Me
  about_me: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  success_stories: z.array(z.object({
    client_name: z.string().trim().min(1, "Invalid value"),
    age: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0),
    story_details: z.string().trim().min(1, "Invalid value")
  })).optional(),
  
  // Legacy fields for backward compatibility
  city: z.string().trim().min(1, "Invalid value"),
  address: z.string().trim().min(1, "Invalid value"),
  total_match_played: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  awards: z.array(z.string().trim().min(1, "Invalid value")).optional(),
  training_locations: z.array(z.string().trim().min(1, "Invalid value")).optional(),
  punch_line: z.string().trim().optional().refine(val => !val || val.length > 0, "Invalid value"),
  level: z.enum(["Beginner", "Intermediate", "Professional"]).optional(),
  coaching_availability: z.array(z.enum(["Personal", "Group", "Home", "Out of City"])).optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
