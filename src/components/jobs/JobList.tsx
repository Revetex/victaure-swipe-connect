import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface JobListProps {
  jobs: Job[];
  onJobDeleted?: () => void;
  isLoading?: boolean;
}

export function JobList({ jobs, onJobDeleted, isLoading }: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="text-center py-12 bg-card dark:bg-gray-800 rounded-lg border border-border">
        <p className="text-muted-foreground dark:text-gray-400">Aucune annonce disponible</p>
        <p className="text-sm text-muted-foreground dark:text-gray-500 mt-2">
          Les annonces apparaîtront ici une fois qu'elles seront créées
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {jobs.map((job, index) => (
        <motion.div 
          key={job.id} 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <JobCard {...job} />
          {onJobDeleted && (
            <JobActions 
              jobId={job.id} 
              employerId={job.employer_id}
              onDelete={onJobDeleted}
              onEdit={() => {}}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}