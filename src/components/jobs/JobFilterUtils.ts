
import { z } from "zod";

export const jobFilterSchema = z.object({
  category: z.string().default("all"),
  subcategory: z.string().default("all"),
  location: z.string().default("all"),
  province: z.string().default("all"),
  remoteType: z.string().default("all"),
  contractType: z.string().default("all"),
  experienceLevel: z.string().default("all"),
  salaryMin: z.number().nullable().default(null),
  salaryMax: z.number().nullable().default(null),
  searchTerm: z.string().default(""),
  postedWithin: z.string().default("all"),
  duration: z.string().default("all"), // Ajout de duration
  minBudget: z.number().nullable().default(null), // Ajout de minBudget
  maxBudget: z.number().nullable().default(null), // Ajout de maxBudget
});

export type JobFilters = z.infer<typeof jobFilterSchema>;

export const defaultFilters: JobFilters = {
  category: "all",
  subcategory: "all",
  location: "all",
  province: "all",
  remoteType: "all",
  contractType: "all",
  experienceLevel: "all",
  salaryMin: null,
  salaryMax: null,
  searchTerm: "",
  postedWithin: "all",
  duration: "all",
  minBudget: null,
  maxBudget: null,
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
