import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { MapPin, Clock, Briefcase, DollarSign } from "lucide-react";

interface JobBadgesProps {
  job: Job;
  displaySalary?: string;
}

export function JobBadges({ job, displaySalary }: JobBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {job.location && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {job.location}
        </Badge>
      )}
      
      {job.contract_type && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {job.contract_type}
        </Badge>
      )}
      
      {job.experience_level && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {job.experience_level}
        </Badge>
      )}
      
      {displaySalary && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {displaySalary}
        </Badge>
      )}
    </div>
  );
}