import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";
import { useTranslation } from "react-i18next";

interface JobListProps {
  jobs: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ jobs, onJobDeleted }: JobListProps) {
  const { t } = useTranslation();

  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("marketplace.noJobs")}</p>
        <p className="text-sm text-muted-foreground mt-2">{t("marketplace.comeBack")}</p>
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