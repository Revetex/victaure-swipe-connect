
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobCard } from "./JobCard";
import { useSwipeJobs } from "./swipe/useSwipeJobs";
import { JobFilters } from "./JobFilterUtils";
import { Job } from "@/types/job";
import { EmptyState } from "@/components/ui/empty-state";

interface JobListProps {
  filters: JobFilters;
  showFilters: boolean;
  jobs?: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ filters, showFilters, jobs: propJobs, onJobDeleted }: JobListProps) {
  const { jobs: fetchedJobs, loading } = useSwipeJobs(filters);
  const jobs = propJobs || fetchedJobs;

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Chargement des offres...</p>
      </motion.div>
    );
  }

  if (!jobs?.length) {
    return (
      <EmptyState
        icon={Search}
        title="Aucune offre trouvée"
        description="Essayez de modifier vos critères de recherche"
        className="py-12"
      />
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <motion.div 
        className="grid gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <AnimatePresence mode="popLayout">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <JobCard job={job} onDeleted={onJobDeleted} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}
