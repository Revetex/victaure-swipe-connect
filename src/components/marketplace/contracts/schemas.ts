
import { z } from "zod";

export const contractFormSchema = z.object({
  title: z.string().min(3, { message: "Title is required and must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description is required and must be at least 10 characters" }),
  budget_min: z.number().min(0, { message: "Minimum budget cannot be negative" }),
  budget_max: z.number().min(0, { message: "Maximum budget cannot be negative" }),
  deadline: z.date().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  currency: z.string().default("CAD"),
  requirements: z.array(z.string()).default([])
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;
