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
      console.log("Fetching jobs...");
      
      // Fetch regular jobs
      const { data: regularJobs, error: regularError } = await supabase
        .from("jobs")
        .select("*")
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      if (regularError) {
        console.error("Error fetching regular jobs:", regularError);
        throw regularError;
      }

      console.log("Regular jobs fetched:", regularJobs?.length || 0);

      // Fetch scraped jobs
      const { data: scrapedJobs, error: scrapedError } = await supabase
        .from("scraped_jobs")
        .select("*")
        .order("posted_at", { ascending: false });

      if (scrapedError) {
        console.error("Error fetching scraped jobs:", scrapedError);
        throw scrapedError;
      }

      console.log("Scraped jobs fetched:", scrapedJobs?.length || 0);

      // Convert regular jobs to the correct type
      const typedRegularJobs = (regularJobs || []).map(job => ({
        ...job,
        status: job.status as 'open' | 'closed' | 'in-progress',
        source: 'Victaure' as const
      }));

      // Convert scraped jobs to match the Job type
      const typedScrapedJobs = (scrapedJobs || [] as ScrapedJob[]).map(job => ({
        id: job.id,
        title: job.title,
        description: job.description || '',
        budget: 0,
        location: job.location,
        employer_id: '',
        status: 'open' as 'open' | 'closed' | 'in-progress',
        company: job.company,
        source: 'Externe' as const,
        created_at: job.created_at,
        updated_at: job.updated_at,
        category: 'Externe',
        contract_type: 'full-time',
        experience_level: 'mid-level',
        url: job.url
      }));

      // Combine both types of jobs
      const allJobs = [...typedRegularJobs, ...typedScrapedJobs];
      
      // Sort all jobs by creation date
      const sortedJobs = allJobs.sort((a, b) => {
        const dateA = new Date(a.created_at || '');
        const dateB = new Date(b.created_at || '');
        return dateB.getTime() - dateA.getTime();
      });

      console.log("Total jobs found:", sortedJobs.length);
      setJobs(sortedJobs);

    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Erreur lors du chargement des offres");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
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
            <h2 className="text-xl font-semibold">Toutes les offres</h2>
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