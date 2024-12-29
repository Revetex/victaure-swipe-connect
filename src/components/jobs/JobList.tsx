import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  onJobDeleted?: () => void;
}

export function JobList({ jobs, isLoading, onJobDeleted }: JobListProps) {
  if (isLoading) {
    return (
      <div className="lg:col-span-3 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="lg:col-span-3 text-center py-8">
        <p className="text-muted-foreground">Aucune annonce disponible</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 lg:col-span-3">
      {jobs.map((job) => (
        <div key={job.id} className="relative">
          <JobCard {...job} />
          <JobActions 
            jobId={job.id} 
            employerId={job.employer_id}
            onDelete={onJobDeleted || (() => {})}
            onEdit={() => {}}
          />
        </div>
      ))}
    </div>
  );
}