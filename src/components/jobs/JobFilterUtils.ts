import { z } from "zod";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/integrations/supabase/types";

type JobRow = Database['public']['Tables']['jobs']['Row'];

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

export const applyFilters = (
  query: PostgrestFilterBuilder<any, any, any>,
  filters: JobFilters
) => {
  if (filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory !== "all") {
    query = query.eq("subcategory", filters.subcategory);
  }

  if (filters.experienceLevel !== "all") {
    query = query.eq("experience_level", filters.experienceLevel);
  }

  if (filters.remoteType !== "all") {
    query = query.eq("remote_type", filters.remoteType);
  }

  if (filters.missionType !== "all") {
    query = query.eq("mission_type", filters.missionType);
  }

  if (filters.contractType !== "all") {
    query = query.eq("contract_type", filters.contractType);
  }

  if (filters.paymentSchedule !== "all") {
    query = query.eq("payment_schedule", filters.paymentSchedule);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters.minBudget) {
    query = query.gte("budget", filters.minBudget);
  }

  if (filters.maxBudget) {
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

  if (filters.skills && filters.skills.length > 0) {
    query = query.contains("required_skills", filters.skills);
  }

  return query;
};