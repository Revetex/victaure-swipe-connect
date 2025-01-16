import { useEffect, useState, useMemo, useCallback } from "react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { useQuery } from "@tanstack/react-query";

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
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Optimized data fetching with React Query
  const { data: regularJobs = [], isLoading: isLoadingRegular } = useQuery({
    queryKey: ['regular-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: scrapedJobs = [], isLoading: isLoadingScraped } = useQuery({
    queryKey: ['scraped-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scraped_jobs")
        .select("*")
        .order("posted_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Memoized job conversion functions
  const convertRegularJobs = useCallback((jobs: any[]): Job[] => {
    return jobs.map(job => ({
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
  }, []);

  const convertScrapedJobs = useCallback((jobs: ScrapedJob[]): Job[] => {
    return jobs.map(job => ({
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
      experience_level: 'mid-level',
      url: job.url
    }));
  }, []);

  // Memoized combined and filtered jobs
  const allJobs = useMemo(() => {
    const regular = convertRegularJobs(regularJobs);
    const scraped = convertScrapedJobs(scrapedJobs);
    const combined = [...regular, ...scraped];
    
    return combined.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [regularJobs, scrapedJobs, convertRegularJobs, convertScrapedJobs]);

  const handleFilterChange = useCallback((key: keyof JobFiltersType, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const isLoading = isLoadingRegular || isLoadingScraped;

  return (
    <section className="py-8 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <JobCreationDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSuccess={() => {
              toast.success("Mission créée avec succès !");
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Toutes les offres ({allJobs.length})
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
              jobs={allJobs} 
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}