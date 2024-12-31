import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";
import { motion, AnimatePresence } from "framer-motion";

interface JobListProps {
  jobs: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ jobs, onJobDeleted }: JobListProps) {
  if (!jobs.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <p className="text-muted-foreground">Aucune annonce disponible</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid gap-4 sm:gap-6 lg:col-span-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <AnimatePresence>
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
              onDelete={onJobDeleted || (() => {})}
              onEdit={() => {}}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}