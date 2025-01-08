import { useEffect, useState } from "react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { defaultFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { useJobFilters } from "@/utils/filters/useJobFilters";

export function Marketplace() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, handleFilterChange } = useJobFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      console.log("Starting job fetch...");
      
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