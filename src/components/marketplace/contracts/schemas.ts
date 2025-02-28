
import { z } from "zod";

// Schéma de validation pour le formulaire de contrat
export const contractValidationSchema = z.object({
  title: z.string().min(10, { message: "Le titre doit contenir au moins 10 caractères" }),
  description: z.string().min(50, { message: "La description doit contenir au moins 50 caractères" }),
  budget_min: z.coerce.number().optional(),
  budget_max: z.coerce.number().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  deadline: z.date().optional()
});

export type ContractFormData = z.infer<typeof contractValidationSchema>;
