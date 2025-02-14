
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobCard } from "./JobCard";
import { useSwipeJobs } from "./swipe/useSwipeJobs";
import { JobFilters } from "./JobFilterUtils";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";

export interface JobListProps {
  filters: JobFilters;
  showFilters: boolean;
  jobs?: Job[];
  onJobDeleted?: () => void;
  filterType: "regular" | "contract" | "marketplace";
}

export function JobList({ filters, showFilters, jobs: propJobs, onJobDeleted, filterType }: JobListProps) {
  const { jobs: fetchedJobs, loading } = useSwipeJobs({ ...filters, source: filterType });
  const jobs = propJobs || fetchedJobs;

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[50vh]"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </motion.div>
    );
  }

  if (!jobs?.length) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
        <Search className="h-12 w-12 mb-4" />
        <h3 className="font-semibold text-lg">Aucune offre trouvée</h3>
        <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] px-4 md:px-0">
      <motion.div 
        className="grid gap-6 pb-6"
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
