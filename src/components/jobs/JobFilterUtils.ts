import { z } from "zod";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

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
  missionType: z.enum(["all", "company", "individual"]).default("all"),
  paymentSchedule: z.string().default("all"),
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
  missionType: "all",
  paymentSchedule: "all",
};

export const applyJobFilters = (
  query: PostgrestFilterBuilder<any, any, any>,
  filters: JobFilters
): PostgrestFilterBuilder<any, any, any> => {
  if (filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory !== "all") {
    query = query.eq("subcategory", filters.subcategory);
  }

  if (filters.duration !== "all") {
    query = query.eq("contract_type", filters.duration);
  }

  if (filters.experienceLevel !== "all") {
    query = query.eq("experience_level", filters.experienceLevel);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters.remoteType !== "all") {
    query = query.eq("remote_type", filters.remoteType);
  }

  if (filters.missionType !== "all") {
    query = query.eq("mission_type", filters.missionType);
  }

  if (filters.paymentSchedule !== "all") {
    query = query.eq("payment_schedule", filters.paymentSchedule);
  }

  if (filters.minBudget > 0) {
    query = query.gte("budget", filters.minBudget);
  }

  if (filters.maxBudget < 1000) {
    query = query.lte("budget", filters.maxBudget);
  }

  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  if (filters.createdAfter) {
    query = query.gte("created_at", filters.createdAfter);
  }

  if (filters.createdBefore) {
    query = query.lte("created_at", filters.createdBefore);
  }

  if (filters.deadlineBefore) {
    query = query.lte("application_deadline", filters.deadlineBefore);
  }

  return query;
};