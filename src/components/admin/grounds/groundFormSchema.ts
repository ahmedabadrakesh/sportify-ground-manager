
import * as z from "zod";

export const groundSchema = z.object({
  name: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Name must be at least 2 characters"),
  description: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 10, "Description must be at least 10 characters"),
  address: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 5, "Address must be at least 5 characters"),
  games: z.array(z.string()),
  facilities: z.array(z.string()),
  ownerId: z.string().optional(),
});

export type GroundFormValues = z.infer<typeof groundSchema>;
