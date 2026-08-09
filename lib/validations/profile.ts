import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Full name is required.").max(80),
  id: z.string().trim().min(1, "ID number is required.").max(60),
  designation: z.string().trim().max(120).optional(),
  department: z.string().trim().max(120).optional(),
  organization: z.string().trim().min(1, "Organization is required.").max(120),
  email: z
    .string()
    .trim()
    .max(254)
    .email("Enter a valid email address.")
    .or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const qrValueSchema = z
  .string()
  .trim()
  .min(1, "QR content is required.")
  .max(500, "QR content is too long.");