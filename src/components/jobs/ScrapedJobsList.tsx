
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useJobsData } from "@/hooks/useJobsData";
import type { ScrapedJobsListProps } from "@/types/jobs/types";
import { JobCard } from "./JobCard";
import type { Job } from "@/types/job";
import { JobFilterUtils, defaultFilters } from "./JobFilterUtils";
import { useState } from "react";
import { FilterSection } from "./filters/FilterSection";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ScrapedJobsList({ queryString = "" }: ScrapedJobsListProps) {
  const { data: jobs = [], isLoading } = useJobsData(queryString);
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);

  // Convertir les UnifiedJob en Job avec tous les champs requis
  const convertedJobs: Job[] = jobs.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description || '',
    budget: 0,
    location: job.location,
    employer_id: '',
    status: 'open',
    category: '',
    contract_type: '',
    experience_level: '',
    created_at: job.posted_at,
    company: job.company,
    source: job.source === 'Victaure' ? 'internal' : 'external',
    url: job.url
  }));

  // Filtrer les offres selon les critères
  const filteredJobs = JobFilterUtils.applyFilters(convertedJobs, filters);

  // Gérer le changement des filtres
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center p-8" 
        role="status" 
        aria-label="Chargement des offres d'emploi"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className={cn(
        "lg:w-80 shrink-0",
        showFilters ? "block" : "hidden lg:block"
      )}>
        <JobFiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </aside>

      <main className="flex-1 space-y-4">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button 
            variant="outline" 
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>

        <FilterSection 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col space-y-4"
        >
          {filteredJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              role="status"
            >
              <div className="rounded-full bg-muted p-6 mb-2">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Aucune offre trouvée</h3>
              <p className="text-muted-foreground max-w-sm">
                Essayez de modifier vos critères de recherche pour voir plus d'opportunités
              </p>
              <Button 
                variant="outline"
                onClick={() => setFilters(defaultFilters)}
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          ) : (
            <div 
              className="space-y-4" 
              role="list" 
              aria-label="Liste des offres d'emploi"
            >
              {filteredJobs.map((job) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  role="listitem"
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
