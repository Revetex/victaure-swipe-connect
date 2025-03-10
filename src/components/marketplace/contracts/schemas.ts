
import * as z from "zod";

export const contractValidationSchema = z.object({
  title: z.string().min(3, "Le titre doit comporter au moins 3 caractères"),
  description: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  deadline: z.date().optional(),
  currency: z.string().default("CAD"),
  requirements: z.array(z.string()).optional()
});

export type ContractFormData = z.infer<typeof contractValidationSchema>;

// Simple contract form schema for validation
export const contractFormSchema = {
  title: { required: 'Title is required' },
  description: { required: 'Description is required' },
  budget_min: { required: 'Minimum budget is required' },
  budget_max: { required: 'Maximum budget is required' }
};
