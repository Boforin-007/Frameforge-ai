import { z } from "zod";

export const templateElementSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(["text", "image", "qr", "rect"]).optional(),
  })
  .passthrough();

export const cardTemplateSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().optional(),
  width: z.number().positive().max(4096),
  height: z.number().positive().max(4096),
  background: z.string().min(1),
  accent: z.string().optional(),
  elements: z.array(templateElementSchema).min(1),
});

export const saveTemplateSchema = z.object({
  name: z.string().trim().min(1, "Template name is required.").max(120),
  data: cardTemplateSchema,
});

export const saveProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required.").max(200),
  template: z.unknown(),
  profile: z.unknown(),
});

export type SaveTemplateInput = z.infer<typeof saveTemplateSchema>;
export type SaveProjectInput = z.infer<typeof saveProjectSchema>;