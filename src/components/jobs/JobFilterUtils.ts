import { z } from "zod";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

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

export const applyFilters = async (
  query: PostgrestFilterBuilder<any, any, any>,
  filters: JobFilters
): Promise<PostgrestFilterBuilder<any, any, any>> => {
  let filteredQuery = query;

  // If a category is selected, first get its name from the database
  if (filters.category !== "all") {
    const { data: categoryData } = await supabase
      .from('job_categories')
      .select('name')
      .eq('id', filters.category)
      .single();
    
    if (categoryData) {
      filteredQuery = filteredQuery.eq("category", categoryData.name);
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
      filteredQuery = filteredQuery.eq("subcategory", subcategoryData.name);
    }
  }

  if (filters.experienceLevel !== "all") {
    filteredQuery = filteredQuery.eq("experience_level", filters.experienceLevel);
  }

  if (filters.remoteType !== "all") {
    filteredQuery = filteredQuery.eq("remote_type", filters.remoteType);
  }

  if (filters.missionType !== "all") {
    filteredQuery = filteredQuery.eq("mission_type", filters.missionType);
  }

  if (filters.contractType !== "all") {
    filteredQuery = filteredQuery.eq("contract_type", filters.contractType);
  }

  if (filters.paymentSchedule !== "all") {
    filteredQuery = filteredQuery.eq("payment_schedule", filters.paymentSchedule);
  }

  if (filters.location) {
    filteredQuery = filteredQuery.ilike("location", `%${filters.location}%`);
  }

  if (filters.minBudget) {
    filteredQuery = filteredQuery.gte("budget", filters.minBudget);
  }

  if (filters.maxBudget) {
    filteredQuery = filteredQuery.lte("budget", filters.maxBudget);
  }

  if (filters.searchTerm) {
    filteredQuery = filteredQuery.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  if (filters.createdAfter) {
    filteredQuery = filteredQuery.gte("created_at", filters.createdAfter);
  }

  if (filters.createdBefore) {
    filteredQuery = filteredQuery.lte("created_at", filters.createdBefore);
  }

  if (filters.deadlineBefore) {
    filteredQuery = filteredQuery.lte("application_deadline", filters.deadlineBefore);
  }

  if (filters.skills && filters.skills.length > 0) {
    filteredQuery = filteredQuery.contains("required_skills", filters.skills);
  }

  return filteredQuery;
};