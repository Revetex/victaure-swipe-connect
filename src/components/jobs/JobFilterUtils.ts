import { supabase } from "@/integrations/supabase/client";

export interface JobFilters {
  category: string;
  subcategory: string;
  duration: string;
  experienceLevel: string;
  location: string;
  province: string;
  searchTerm: string;
}

export const applyJobFilters = (query: any, filters: JobFilters) => {
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory && filters.subcategory !== "all") {
    query = query.eq("subcategory", filters.subcategory);
  }

  if (filters.duration && filters.duration !== "all") {
    query = query.eq("contract_type", filters.duration);
  }

  if (filters.experienceLevel && filters.experienceLevel !== "all") {
    query = query.eq("experience_level", filters.experienceLevel);
  }

  if (filters.location) {
    query = query.eq("location", filters.location);
  }

  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  return query;
};