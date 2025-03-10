
import * as z from 'zod';
import { ContractFormValues } from '@/types/marketplace';

export const contractValidationSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  budget_min: z.number().positive({ message: "Minimum budget must be positive" }),
  budget_max: z.number().positive({ message: "Maximum budget must be positive" }),
  deadline: z.date().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  currency: z.string().default('CAD')
});

export type ContractFormData = z.infer<typeof contractValidationSchema>;

// Default values for the contract form
export const defaultContractValues: ContractFormValues = {
  title: '',
  description: '',
  budget_min: 0,
  budget_max: 0,
  location: '',
  category: '',
  requirements: [],
  currency: 'CAD'
};

// Format a Date object to ISO string format for API submission
export const formatDateForApi = (date?: Date): string | undefined => {
  if (!date) return undefined;
  return date.toISOString();
};
