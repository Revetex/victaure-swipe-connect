import { z } from "zod";

export const filterSchema = z.object({
  category: z.string().default("all"),
  subcategory: z.string().default("all"),
  duration: z.string().default("all"),
  location: z.string().default(""),
  skills: z.array(z.string()).default([]),
  experienceLevel: z.string().default("all"),
  province: z.string().default("all"),
  remoteType: z.string().default("all"),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  searchTerm: z.string().default(""),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  deadlineBefore: z.string().optional(),
  missionType: z.enum(["all", "company", "individual"]).default("all"),
  contractType: z.string().default("all"),
  paymentSchedule: z.string().default("all"),
});

export type JobFilters = z.infer<typeof filterSchema>;

export const defaultFilters: JobFilters = {
  category: "all",
  subcategory: "all",
  duration: "all",
  location: "",
  skills: [],
  experienceLevel: "all",
  province: "all",
  remoteType: "all",
  searchTerm: "",
  missionType: "all",
  contractType: "all",
  paymentSchedule: "all",
};