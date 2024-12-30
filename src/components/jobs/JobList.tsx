import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";
import { Loader2 } from "lucide-react";

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
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">Aucune annonce disponible</p>
        <p className="text-sm text-muted-foreground mt-2">
          Les annonces apparaîtront ici une fois qu'elles seront créées
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="relative">
          <JobCard {...job} />
          {onJobDeleted && (
            <JobActions 
              jobId={job.id} 
              employerId={job.employer_id}
              onDelete={onJobDeleted}
              onEdit={() => {}}
            />
          )}
        </div>
      ))}
    </div>
  );
}