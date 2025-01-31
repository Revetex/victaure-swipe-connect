import { Building2, MapPin, Calendar, Clock, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const formattedDate = formatDistanceToNow(new Date(job.created_at || new Date()), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <Card className="relative p-6 hover:shadow-lg transition-shadow bg-card">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold truncate">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
          <Badge variant={job.source === 'Victaure' ? 'default' : 'secondary'} className="shrink-0">
            {job.source || 'Victaure'}
          </Badge>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{job.contract_type}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {job.budget > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span>{job.budget} CAD</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}