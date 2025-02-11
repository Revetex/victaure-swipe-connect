import { JobCard } from "@/components/jobs/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        className="flex flex-col items-center justify-center py-8 space-y-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des offres...</p>
      </motion.div>
    );
  }

  if (!jobs?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-8 space-y-4"
      >
        <Search className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Aucune annonce disponible</p>
          <p className="text-sm text-muted-foreground">
            Essayez d'ajuster vos filtres pour voir plus d'offres
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <motion.div 
        className="grid gap-4 sm:gap-6 pr-4"
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
              <JobCard job={job} />
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
    </ScrollArea>
  );
}
