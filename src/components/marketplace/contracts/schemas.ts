
import * as z from "zod";

// Define the contract form validation schema
export const contractValidationSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  budget_min: z.number().min(0, "Le budget minimum doit être positif"),
  budget_max: z.number().min(0, "Le budget maximum doit être positif"),
  location: z.string().optional(),
  category: z.string().optional(),
  deadline: z.date().optional(),
  currency: z.string().default("CAD"),
  requirements: z.array(z.string()).default([]),
});

// Create a type from the schema
export type ContractFormData = z.infer<typeof contractValidationSchema>;

// Utility function to format Date for the API
export const formatDateForApi = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toISOString();
};

// Helper function to convert form values to API format
export const prepareContractForApi = (formData: ContractFormData, userId: string): any => {
  return {
    title: formData.title,
    description: formData.description,
    budget_min: formData.budget_min,
    budget_max: formData.budget_max,
    location: formData.location || null,
    category: formData.category || null,
    deadline: formData.deadline ? formatDateForApi(formData.deadline) : null,
    currency: formData.currency || "CAD",
    requirements: formData.requirements,
    creator_id: userId,
    status: "open"
  };
};
