import { z } from "zod";

export const gymSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  location: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  }),
  ownerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  passPrice: z.coerce.number().min(0, "Price must be positive").optional(),
  googleMapsUrl: z
    .string()
    .url("Invalid Google Maps URL")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type GymFormValues = z.infer<typeof gymSchema>;
