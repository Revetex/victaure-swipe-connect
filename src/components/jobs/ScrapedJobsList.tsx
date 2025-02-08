
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useJobsData } from "@/hooks/useJobsData";
import type { ScrapedJobsListProps } from "@/types/jobs/types";
import { JobCard } from "./JobCard";
import type { Job } from "@/types/job";

export function ScrapedJobsList({ queryString = "" }: ScrapedJobsListProps) {
  const { data: jobs = [], isLoading } = useJobsData(queryString);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" role="status" aria-label="Chargement des offres d'emploi">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  // Convertir les UnifiedJob en Job
  const convertedJobs: Job[] = jobs.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description || '',
    budget: 0, // Valeur par défaut
    location: job.location,
    employer_id: '', // Valeur par défaut
    status: 'open', // Valeur par défaut
    category: '', // Valeur par défaut
    contract_type: '',
    experience_level: '',
    created_at: job.posted_at,
    company: job.company,
    source: job.source === 'Victaure' ? 'internal' : 'external',
    url: job.url
  }));

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        {convertedJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" role="status">
            Aucune offre disponible
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Liste des offres d'emploi">
            {convertedJobs.map((job) => (
              <div key={job.id} role="listitem">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
