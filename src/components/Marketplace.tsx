import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters, applyFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";
import { toast } from "sonner";

export function Marketplace() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      console.log("Fetching jobs with filters:", filters);
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
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      // Apply filters using the utility function
      const filteredQuery = await applyFilters(query, filters);
      console.log("Filtered query:", filteredQuery);

      const { data, error } = await filteredQuery;

      if (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Erreur lors du chargement des offres");
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No jobs found");
        return [];
      }

      console.log("Fetched jobs:", data);
      return data.map(job => ({
        ...job,
        company: job.employer?.company_name || job.company_name || "Entreprise",
        employer_name: job.employer?.full_name || "Employeur",
        employer_avatar: job.employer?.avatar_url,
        skills: job.required_skills || [],
        salary: job.budget ? `${job.budget} ${job.salary_currency || 'CAD'}` : 'À discuter'
      })) as Job[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2
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

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {showFilters ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <JobFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
              <div className="lg:col-span-3">
                <JobList jobs={jobs} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <div className="col-span-1">
              <JobList jobs={jobs} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}