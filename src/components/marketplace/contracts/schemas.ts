
import { z } from 'zod';

// Schéma Zod pour la validation des contrats
export const contractSchema = z.object({
  title: z.string().min(10, "Le titre doit faire au moins 10 caractères"),
  description: z.string().min(50, "La description doit faire au moins 50 caractères"),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  deadline: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  currency: z.string().default("CAD")
});

export type ContractSchemaType = z.infer<typeof contractSchema>;

// Utilities pour la validation de formulaire
export const validateContract = (data: any) => {
  try {
    return {
      success: true,
      data: contractSchema.parse(data)
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      errors: [{ path: 'form', message: 'Une erreur est survenue' }]
    };
  }
};
