
import { Job } from "@/types/job";
import { JobCard } from "../JobCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onResetFilters?: () => void;
}

export function JobsResults({ jobs, onJobSelect, onResetFilters }: JobsResultsProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Aucune offre d'emploi ne correspond à vos critères</p>
        {onResetFilters && (
          <Button 
            onClick={onResetFilters}
            variant="outline"
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClick={() => onJobSelect(job)} />
      ))}
    </div>
  );
}
