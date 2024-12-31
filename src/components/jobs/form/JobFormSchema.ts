import * as z from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  budget: z.string().min(1, "Le budget est requis"),
  location: z.string().min(1, "La localisation est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().min(1, "La sous-catégorie est requise"),
  contract_type: z.string().min(1, "Le type de contrat est requis"),
  experience_level: z.enum([
    "Entry-Level",
    "Mid-Level", 
    "Senior",
    "Expert",
    "Lead"
  ], {
    required_error: "Le niveau d'expérience est requis",
    invalid_type_error: "Niveau d'expérience invalide"
  }),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;