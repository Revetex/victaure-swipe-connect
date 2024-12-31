import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";
import type { JobFilters } from "../../jobs/JobFilterUtils";

export function useJobsQuery(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("jobs")
          .select(`
            *,
            employer:profiles(
              full_name,
              company_name,
              avatar_url
            )
          `)
          .eq("status", "open")
          .order("created_at", { ascending: false });

        // Apply filters
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
        if (filters.location && filters.location !== "all") {
          query = query.eq("location", filters.location);
        }
        if (filters.searchTerm) {
          query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data.map(job => ({
          ...job,
          company: job.employer?.company_name || "Entreprise",
          salary: `${job.budget} CAD`,
          skills: job.required_skills || [],
        })) as Job[];
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
    }
  });
}