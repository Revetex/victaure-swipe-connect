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

      const { data: regularJobs, error: regularError } = await filteredQuery;

      if (regularError) {
        console.error("Error fetching regular jobs:", regularError);
        throw regularError;
      }

      // Also fetch scraped jobs
      const { data: scrapedJobs, error: scrapedError } = await supabase
        .from("scraped_jobs")
        .select("*")
        .order("posted_at", { ascending: false });

      if (scrapedError) {
        console.error("Error fetching scraped jobs:", scrapedError);
        throw scrapedError;
      }

      // Format regular jobs
      const formattedRegularJobs = regularJobs.map(job => ({
        ...job,
        company: job.employer?.company_name || job.company_name || "Entreprise",
        employer_name: job.employer?.full_name || "Employeur",
        employer_avatar: job.employer?.avatar_url,
        skills: job.required_skills || [],
        salary: job.budget ? `${job.budget} ${job.salary_currency || 'CAD'}` : 'À discuter'
      }));

      // Format scraped jobs to match Job type
      const formattedScrapedJobs = scrapedJobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description || "",
        company: job.company,
        location: job.location,
        budget: 0,
        employer_id: "",
        status: "open" as const,
        category: "Technology",
        contract_type: "full-time",
        experience_level: "mid-level",
        created_at: job.posted_at,
        company_name: job.company,
        company_website: job.url,
        is_scraped: true
      }));

      // Combine both types of jobs
      const allJobs = [...formattedRegularJobs, ...formattedScrapedJobs];
      console.log("All jobs:", allJobs);

      if (!allJobs.length) {
        console.log("No jobs found");
        return [];
      }

      return allJobs as Job[];
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
          {showFilters && (
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
          )}
          {!showFilters && (
            <JobList jobs={jobs} isLoading={isLoading} />
          )}
        </div>
      </div>
    </section>
  );
}