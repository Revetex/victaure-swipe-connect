import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { missionCategories, Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters } from "@/types/filters";

export function Marketplace() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*")
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

      if (filters.location) {
        query = query.eq("location", filters.location);
      }

      if (filters.remoteType && filters.remoteType !== "all") {
        query = query.eq("remote_type", filters.remoteType);
      }

      if (filters.minBudget && filters.maxBudget) {
        query = query
          .gte("budget", filters.minBudget)
          .lte("budget", filters.maxBudget);
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

      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(job => ({
        ...job,
        company: "Company Name",
        skills: job.required_skills || ["Skill 1", "Skill 2"],
        salary: `${job.budget} CAD`
      })) as Job[];
    }
  });

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters(prev => {
      // Reset subcategory when changing category
      if (key === "category" && value !== prev.category) {
        return { ...prev, [key]: value, subcategory: "all" };
      }
      return { ...prev, [key]: value };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-victaure-blue"></div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <JobList jobs={jobs} />
        </div>
      </div>
    </section>
  );
}