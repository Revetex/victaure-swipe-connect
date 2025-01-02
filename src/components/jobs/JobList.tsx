import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  onJobDeleted?: () => void;
}

export function JobList({ jobs, isLoading = false, onJobDeleted }: JobListProps) {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center py-8"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  if (!jobs?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 space-y-2"
      >
        <p className="text-muted-foreground">Aucune annonce disponible</p>
        <p className="text-sm text-muted-foreground">Ajustez vos filtres pour voir plus d'offres</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid gap-4 sm:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <JobCard {...job} />
            <JobActions 
              jobId={job.id} 
              employerId={job.employer_id}
              onDelete={onJobDeleted}
              onEdit={() => {}}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}