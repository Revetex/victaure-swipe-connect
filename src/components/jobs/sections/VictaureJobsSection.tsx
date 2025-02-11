import { Job } from "@/types/job";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";

interface VictaureJobsSectionProps {
  jobs: Job[];
  isLoading: boolean;
  onRetry: () => void;
}

export function VictaureJobsSection({ jobs, isLoading, onRetry }: VictaureJobsSectionProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Offres Victaure</h3>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des offres Victaure...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <Search className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune offre Victaure disponible</p>
          <Button onClick={onRetry} variant="outline">
            Actualiser
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {jobs.map((job) => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card hover:bg-accent/50 transition-colors rounded-lg border p-4"
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
