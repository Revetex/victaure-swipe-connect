import { supabase } from "@/integrations/supabase/client";

export interface JobFilters {
  category: string;
  duration: string;
  salaryRange: number[];
  experienceLevel: string;
  location: string;
  searchTerm: string;
}

export const applyJobFilters = (query: any, filters: JobFilters) => {
  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.duration) {
    query = query.eq("contract_type", filters.duration);
  }

  if (filters.salaryRange) {
    query = query
      .gte("budget", filters.salaryRange[0])
      .lte("budget", filters.salaryRange[1]);
  }

  if (filters.experienceLevel) {
    query = query.eq("experience_level", filters.experienceLevel);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  return query;
};