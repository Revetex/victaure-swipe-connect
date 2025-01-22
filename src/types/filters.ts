import { z } from "zod";

export const filterSchema = z.object({
  category: z.string().default("all"),
  subcategory: z.string().default("all"),
  duration: z.string().default("all"),
  experienceLevel: z.string().default("all"),
  location: z.string().default(""),
  province: z.string().default(""),
  remoteType: z.string().default("all"),
  minBudget: z.number().default(300),
  maxBudget: z.number().default(1000),
  skills: z.array(z.string()).default([]),
  searchTerm: z.string().default(""),
  createdAfter: z.string().nullable().default(null),
  createdBefore: z.string().nullable().default(null),
  deadlineBefore: z.string().nullable().default(null),
  search: z.string().default(""),
  categories: z.array(z.string()).default([]),
  missionType: z.string().default("all"),
  paymentSchedule: z.string().default("all")
});

export type JobFilters = z.infer<typeof filterSchema>;

export const defaultFilters: JobFilters = {
  category: "all",
  subcategory: "all",
  duration: "all",
  experienceLevel: "all",
  location: "",
  province: "",
  remoteType: "all",
  minBudget: 300,
  maxBudget: 1000,
  skills: [],
  searchTerm: "",
  createdAfter: null,
  createdBefore: null,
  deadlineBefore: null,
  search: "",
  categories: [],
  missionType: "all",
  paymentSchedule: "all"
};