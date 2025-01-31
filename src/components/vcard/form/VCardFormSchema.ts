import * as z from "zod";

export const vCardFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  skills: z.array(z.string()).optional(),
  phone: z.string().optional(),
});

export type VCardFormValues = z.infer<typeof vCardFormSchema>;