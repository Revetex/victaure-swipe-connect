
import * as z from 'zod';

export const contractValidationSchema = z.object({
  title: z.string()
    .min(10, { message: "Le titre doit faire au moins 10 caractères" })
    .nonempty({ message: "Le titre est requis" }),
  description: z.string()
    .min(50, { message: "La description doit faire au moins 50 caractères" })
    .nonempty({ message: "La description est requise" }),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  deadline: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  currency: z.string().optional()
});

export type ContractFormData = z.infer<typeof contractValidationSchema>;
