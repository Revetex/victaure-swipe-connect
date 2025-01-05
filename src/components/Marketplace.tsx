import { useEffect, useState } from "react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { ScrapedJobsList } from "./jobs/ScrapedJobsList";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters, applyFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { JobCreationDialog } from "./jobs/JobCreationDialog";

export function Marketplace() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Convert the status to the correct type
      const typedJobs = (data || []).map(job => ({
        ...job,
        status: job.status as 'open' | 'closed' | 'in-progress'
      }));

      setJobs(typedJobs);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Offres Victaure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Offres Victaure</h2>
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
              <JobList jobs={jobs} isLoading={isLoading} />
            </div>
          </div>

          {/* Offres Externes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Offres Externes</h2>
            <ScrapedJobsList />
          </div>
        </div>
      </div>
    </section>
  );
}