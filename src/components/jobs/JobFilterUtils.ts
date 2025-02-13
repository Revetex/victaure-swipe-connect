
import { z } from "zod";

export const jobFilterSchema = z.object({
  // Propriétés de base
  category: z.string().default("all"),
  subcategory: z.string().default("all"),
  location: z.string().default("all"),
  province: z.string().default("all"),
  remoteType: z.string().default("all"),
  contractType: z.string().default("all"),
  experienceLevel: z.string().default("all"),
  searchTerm: z.string().default(""),
  postedWithin: z.string().default("all"),
  
  // Propriétés salariales et budget
  salaryMin: z.number().nullable().default(null),
  salaryMax: z.number().nullable().default(null),
  minBudget: z.number().nullable().default(null),
  maxBudget: z.number().nullable().default(null),
  
  // Propriétés additionnelles
  duration: z.string().default("all"),
  missionType: z.string().default("company"),
  paymentSchedule: z.string().default("monthly"),
});

export type JobFilters = z.infer<typeof jobFilterSchema>;

export const defaultFilters: JobFilters = {
  // Propriétés de base
  category: "all",
  subcategory: "all",
  location: "all",
  province: "all",
  remoteType: "all",
  contractType: "all",
  experienceLevel: "all",
  searchTerm: "",
  postedWithin: "all",
  
  // Propriétés salariales et budget
  salaryMin: null,
  salaryMax: null,
  minBudget: null,
  maxBudget: null,
  
  // Propriétés additionnelles
  duration: "all",
  missionType: "company",
  paymentSchedule: "monthly",
};

export const experienceLevels = [
  "Débutant",
  "Junior (1-3 ans)",
  "Intermédiaire (3-5 ans)",
  "Senior (5-8 ans)",
  "Expert (8+ ans)"
] as const;

export const remoteTypes = [
  "Sur place",
  "Hybride",
  "Télétravail"
] as const;

export const contractTypes = [
  "CDI",
  "CDD",
  "Freelance",
  "Stage",
  "Alternance"
] as const;

export const postedWithinOptions = [
  { label: "24 dernières heures", value: "24h" },
  { label: "3 derniers jours", value: "3d" },
  { label: "7 derniers jours", value: "7d" },
  { label: "30 derniers jours", value: "30d" },
  { label: "Tout", value: "all" }
] as const;
