
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useJobsData } from "@/hooks/useJobsData";
import type { ScrapedJobsListProps } from "@/types/jobs/types";
import { JobCard } from "./JobCard";

export function ScrapedJobsList({ queryString = "" }: ScrapedJobsListProps) {
  const { data: jobs = [], isLoading } = useJobsData(queryString);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" role="status" aria-label="Chargement des offres d'emploi">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-6"
      >
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" role="status">
            Aucune offre disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Liste des offres d'emploi">
            {jobs.map((job, index) => (
              <div key={job.id} role="listitem">
                <JobCard job={job} index={index} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
