import { useEffect, useState } from "react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JobCreationDialog } from "./jobs/JobCreationDialog";

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  url?: string;
  posted_at: string;
  created_at: string;
  updated_at: string;
}

export function Marketplace() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      console.log("Starting job fetch...");
      
      // Fetch regular jobs with detailed error logging
      const regularJobsResult = await supabase
        .from("jobs")
        .select("*")
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      if (regularJobsResult.error) {
        console.error("Error fetching regular jobs:", regularJobsResult.error);
        throw regularJobsResult.error;
      }

      const regularJobs = regularJobsResult.data || [];
      console.log("Regular jobs fetched:", regularJobs.length);

      // Fetch scraped jobs with detailed error logging
      const scrapedJobsResult = await supabase
        .from("scraped_jobs")
        .select("*")
        .order("posted_at", { ascending: false });

      if (scrapedJobsResult.error) {
        console.error("Error fetching scraped jobs:", scrapedJobsResult.error);
        throw scrapedJobsResult.error;
      }

      const scrapedJobs = scrapedJobsResult.data || [];
      console.log("Scraped jobs fetched:", scrapedJobs.length);

      // Convert regular jobs to the correct type with explicit typing
      const typedRegularJobs: Job[] = regularJobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        budget: job.budget,
        location: job.location,
        employer_id: job.employer_id,
        status: job.status as 'open' | 'closed' | 'in-progress',
        company: job.company_name || 'Entreprise',
        source: 'Victaure' as const,
        created_at: job.created_at,
        updated_at: job.updated_at,
        category: job.category,
        contract_type: job.contract_type,
        experience_level: job.experience_level
      }));

      // Convert scraped jobs to match the Job type with explicit typing
      const typedScrapedJobs: Job[] = scrapedJobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description || '',
        budget: 0,
        location: job.location,
        employer_id: '',
        status: 'open' as const,
        company: job.company,
        source: 'Externe' as const,
        created_at: job.created_at,
        updated_at: job.updated_at,
        category: 'Externe',
        contract_type: 'full-time',
        experience_level: 'mid-level'
      }));

      // Combine and sort all jobs
      const allJobs = [...typedRegularJobs, ...typedScrapedJobs];
      const sortedJobs = allJobs.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      console.log("Total jobs to display:", sortedJobs.length);
      setJobs(sortedJobs);

    } catch (error) {
      console.error("Error in fetchJobs:", error);
      toast.error("Erreur lors du chargement des offres");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    console.log("Initial job fetch triggered");
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des offres...</span>
      </div>
    );
  }

  return (
    <section className="py-8 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <JobCreationDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSuccess={() => {
              fetchJobs();
              toast.success("Mission créée avec succès !");
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Toutes les offres ({jobs.length})
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-auto flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </Button>
          </div>
          
          <div className="space-y-4">
            {showFilters && (
              <div className="bg-card rounded-lg p-4">
                <JobFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
            <JobList 
              jobs={jobs} 
              isLoading={isLoading} 
              onJobDeleted={fetchJobs}
            />
          </div>
        </div>
      </div>
    </section>
  );
}