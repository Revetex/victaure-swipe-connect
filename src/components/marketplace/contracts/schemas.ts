
import * as z from "zod";

export const contractValidationSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  budget_min: z.number().min(0, "Le budget minimal doit être positif"),
  budget_max: z.number().min(0, "Le budget maximal doit être positif"),
  deadline: z.date().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  currency: z.string().default("CAD"),
  requirements: z.array(z.string()).default([])
});

export type ContractFormData = z.infer<typeof contractValidationSchema>;
