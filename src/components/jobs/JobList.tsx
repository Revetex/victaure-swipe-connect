
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobCard } from "./JobCard";
import { useSwipeJobs } from "./swipe/useSwipeJobs";
import { JobFilters } from "./JobFilterUtils";

interface JobListProps {
  filters: JobFilters;
  showFilters: boolean;
}

export function JobList({ filters, showFilters }: JobListProps) {
  const { jobs, loading } = useSwipeJobs(filters);

  if (loading) {
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
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <Search className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Aucune offre disponible</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}
