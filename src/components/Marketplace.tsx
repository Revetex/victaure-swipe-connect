import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { missionCategories, Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Marketplace() {
  // State management with proper types
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    duration: "",
    salaryRange: [300, 1000] as [number, number]
  });

  // Query jobs with proper error handling
  const { 
    data: jobs = [], 
    isLoading, 
    refetch,
    error 
  } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (filters.category) {
          query = query.eq("category", filters.category);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data.map(job => ({
          ...job,
          company: "Company Name",
          skills: ["Skill 1", "Skill 2"],
          salary: `${job.budget} CAD`
        })) as Job[];
      } catch (err) {
        console.error("Error fetching jobs:", err);
        throw err;
      }
    }
  });

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-victaure-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        Une erreur est survenue lors du chargement des missions
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <JobFilters
            category={filters.category}
            setCategory={(value) => handleFilterChange("category", value)}
            subcategory={filters.subcategory}
            setSubcategory={(value) => handleFilterChange("subcategory", value)}
            duration={filters.duration}
            setDuration={(value) => handleFilterChange("duration", value)}
            salaryRange={filters.salaryRange}
            setSalaryRange={(value) => handleFilterChange("salaryRange", value)}
            missionCategories={missionCategories}
          />
          <JobList 
            jobs={jobs} 
            onJobDeleted={() => refetch()} 
          />
        </div>
      </div>
    </section>
  );
}