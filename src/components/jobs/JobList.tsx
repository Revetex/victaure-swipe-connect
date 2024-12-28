import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="lg:col-span-3 grid gap-4 sm:gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}