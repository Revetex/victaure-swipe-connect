import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface JobFilters {
  category: string;
  subcategory: string;
  duration: string;
  experienceLevel: string;
  location: string;
  searchTerm: string;
}

export const applyJobFilters = (
  query: PostgrestFilterBuilder<any, any, any>,
  filters: JobFilters
) => {
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters.subcategory && filters.subcategory !== 'all') {
    query = query.eq('subcategory', filters.subcategory);
  }

  if (filters.location && filters.location !== 'all') {
    query = query.eq('location', filters.location);
  }

  if (filters.experienceLevel && filters.experienceLevel !== 'all') {
    query = query.eq('experience_level', filters.experienceLevel);
  }

  if (filters.duration && filters.duration !== 'all') {
    query = query.eq('contract_type', filters.duration);
  }

  return query;
};