
import { Job } from "@/types/job";
import { JobsList } from "../JobsList";
import { JobSearch } from "../JobSearch";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { motion } from "framer-motion";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  selectedJobId?: string;
  onResetFilters: () => void;
}

export function JobsResults({ 
  jobs,
  onJobSelect,
  selectedJobId,
  onResetFilters
}: JobsResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6 bg-card/50 backdrop-blur-sm rounded-lg border shadow-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <JobSearch />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <JobsList 
        jobs={jobs}
        onJobSelect={onJobSelect}
        selectedJobId={selectedJobId}
      />
    </motion.div>
  );
}
