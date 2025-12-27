import { z } from "zod";

export const gymSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  location: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
  ownerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  passPrice: z.coerce.number().min(0, "Price must be positive").optional(),
  isActive: z.boolean().default(true),
});

export type GymFormValues = z.infer<typeof gymSchema>;
