import { z } from "zod";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";

export const filterSchema = z.object({
  category: z.string().default("all"),
  subcategory: z.string().default("all"),
  duration: z.string().default("all"),
  location: z.string().default(""),
  skills: z.array(z.string()).default([]),
  experienceLevel: z.string().default("all"),
  province: z.string().default("all"),
  remoteType: z.enum(["all", "on-site", "remote", "hybrid"]).default("all"),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  searchTerm: z.string().default(""),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  deadlineBefore: z.string().optional(),
  missionType: z.enum(["all", "company", "individual"]).default("all"),
  contractType: z.enum(["all", "full-time", "part-time", "contract", "internship", "one-time", "fixed-duration", "project-based"]).default("all"),
  paymentSchedule: z.enum(["all", "weekly", "biweekly", "monthly", "quarterly", "completion"]).default("all"),
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

export const applyFilters = async (
  query: PostgrestFilterBuilder<any, any, any>,
  filters: JobFilters
): Promise<PostgrestFilterBuilder<any, any, any>> => {
  if (filters.category !== "all") {
    const { data: categoryData } = await supabase
      .from('job_categories')
      .select('name')
      .eq('id', filters.category)
      .single();
    
    if (categoryData) {
      query = query.eq("category", categoryData.name);
    }
  }

  // If a subcategory is selected, get its name from the database
  if (filters.subcategory !== "all") {
    const { data: subcategoryData } = await supabase
      .from('job_subcategories')
      .select('name')
      .eq('id', filters.subcategory)
      .single();
    
    if (subcategoryData) {
      query = query.eq("subcategory", subcategoryData.name);
    }
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
