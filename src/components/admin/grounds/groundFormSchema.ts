
import * as z from "zod";

// Define the form schema
export const groundSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  ownerId: z.string().uuid("Please select a ground owner"),
  games: z.string().min(1, "Please enter at least one game"),
  facilities: z.string().min(1, "Please enter at least one facility"),
});

export type GroundFormValues = z.infer<typeof groundSchema>;
