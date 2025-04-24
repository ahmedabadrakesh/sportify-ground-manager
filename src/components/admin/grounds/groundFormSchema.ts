
import * as z from "zod";

export const groundSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  games: z.array(z.string()),
  facilities: z.array(z.string()),
  ownerId: z.string().optional(),
});

export type GroundFormValues = z.infer<typeof groundSchema>;
