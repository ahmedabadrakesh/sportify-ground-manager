
import * as z from "zod";

export const professionalFormSchema = z.object({
  // Basic Info
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  sex: z.enum(["Male", "Female"] as const).optional(),
  profession_type: z.array(z.enum(["Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"] as const)).min(1, "At least one profession type is required"),
  photo: z.string().optional(),
  academy_name: z.string().trim().optional().refine(val => !val || val.length > 0, "Academy name cannot be just spaces"),
  years_of_experience: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  games_played: z.array(z.string()).min(1, "At least one game is required"),
  is_certified: z.boolean().optional(),
  number_of_clients_served: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  
  // Contact & Social Details
  contact_number: z.string().trim().min(1, "Contact number is required"),
  whatsapp: z.string().trim().optional().refine(val => !val || val.length > 0, "WhatsApp number cannot be just spaces"),
  whatsapp_same_as_phone: z.boolean().optional(),
  email: z.string().trim().email("Invalid email format").min(1, "Email is required"),
  instagram_link: z.string().trim().optional().refine(val => !val || val.length > 0, "Instagram link cannot be just spaces"),
  youtube_link: z.string().trim().optional().refine(val => !val || val.length > 0, "YouTube link cannot be just spaces"),
  linkedin_link: z.string().trim().optional().refine(val => !val || val.length > 0, "LinkedIn link cannot be just spaces"),
  website: z.string().trim().optional().refine(val => !val || val.length > 0, "Website cannot be just spaces"),
  facebook_link: z.string().trim().optional().refine(val => !val || val.length > 0, "Facebook link cannot be just spaces"),
  
  // Professional Details
  district_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  state_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  national_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  international_level_tournaments: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  specialties: z.array(z.string().trim().min(1, "Specialty cannot be empty or just spaces")).optional(),
  certifications: z.array(z.string().trim().min(1, "Certification cannot be empty or just spaces")).optional(),
  education: z.array(z.string().trim().min(1, "Education cannot be empty or just spaces")).optional(),
  accomplishments: z.array(z.string().trim().min(1, "Accomplishment cannot be empty or just spaces")).optional(),
  training_locations_detailed: z.array(z.object({
    location: z.string().trim().min(1, "Location cannot be empty or just spaces"),
    address: z.string().trim().min(1, "Address cannot be empty or just spaces"),
    timings: z.string().trim().min(1, "Timings cannot be empty or just spaces")
  })).optional(),
  
  // Media & Pricing
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  one_on_one_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  group_session_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  online_price: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  free_demo_call: z.boolean().optional(),
  
  // About Me
  about_me: z.string().trim().optional().refine(val => !val || val.length > 0, "About me cannot be just spaces"),
  success_stories: z.array(z.object({
    client_name: z.string().trim().min(1, "Client name cannot be empty or just spaces"),
    age: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0),
    story_details: z.string().trim().min(1, "Story details cannot be empty or just spaces")
  })).optional(),
  
  // Legacy fields for backward compatibility
  city: z.string().trim().min(1, "City is required"),
  address: z.string().trim().min(1, "Address is required"),
  total_match_played: z.union([z.string(), z.number()]).transform((val) => Number(val) || 0).optional(),
  awards: z.array(z.string().trim().min(1, "Award cannot be empty or just spaces")).optional(),
  training_locations: z.array(z.string().trim().min(1, "Training location cannot be empty or just spaces")).optional(),
  punch_line: z.string().trim().optional().refine(val => !val || val.length > 0, "Punch line cannot be just spaces"),
  level: z.enum(["Beginner", "Intermediate", "Professional"]).optional(),
  coaching_availability: z.array(z.enum(["Personal", "Group", "Home", "Out of City"])).optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
