
import { JobFilters } from "./JobFilterUtils";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { motion, AnimatePresence } from "framer-motion";

interface BrowseJobsTabProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BrowseJobsTab({ 
  filters, 
  onFilterChange, 
}: BrowseJobsTabProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full"
      >
        <JobFiltersPanel 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </motion.div>
    </AnimatePresence>
  );
}
