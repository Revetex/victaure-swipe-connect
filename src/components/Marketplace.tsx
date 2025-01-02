import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters, applyFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";

export function Marketplace() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters using the utility function
      const filteredQuery = applyFilters(query, filters);

      const { data, error } = await filteredQuery;

      if (error) throw error;

      return data.map(job => ({
        ...job,
        company: job.company_name || "Entreprise",
        skills: job.required_skills || [],
        salary: `${job.budget} CAD`
      })) as Job[];
    }
  });

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters(prev => {
      if (key === "category" && value !== prev.category) {
        return { ...prev, [key]: value, subcategory: "all" };
      }
      if (key === "missionType" && value !== prev.missionType) {
        return { ...prev, [key]: value, category: "all", subcategory: "all" };
      }
      return { ...prev, [key]: value };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-4 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className={`${!showFilters && "hidden lg:block"} lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)] lg:overflow-auto`}>
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="lg:col-span-3">
            <JobList jobs={jobs} />
          </div>
        </div>
      </div>
    </section>
  );
}