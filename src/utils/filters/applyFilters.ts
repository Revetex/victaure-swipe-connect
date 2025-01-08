import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { JobFilters } from "./filterTypes";
import { supabase } from "@/integrations/supabase/client";

export const applyFilters = async (
  query: PostgrestFilterBuilder<any, any, any>,
  filters: JobFilters
): Promise<PostgrestFilterBuilder<any, any, any>> => {
  let filteredQuery = query;

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