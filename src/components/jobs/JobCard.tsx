
import { Building2, MapPin, Calendar, Clock, Briefcase, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const getFormattedDate = () => {
    try {
      const date = job.created_at ? new Date(job.created_at) : new Date();
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date non disponible';
    }
  };

  return (
    <Card className="relative p-6 hover:shadow-lg transition-shadow bg-card group">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold truncate">{job.title}</h3>
              {job.is_urgent && (
                <Badge variant="destructive" className="shrink-0">Urgent</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {job.mission_type === 'individual' ? 'Mission particulier' : job.company}
              </span>
            </div>
          </div>
          <Badge 
            variant={job.mission_type === 'individual' ? 'secondary' : 'default'} 
            className={cn(
              "shrink-0",
              job.remote_type === 'remote' && "bg-green-500/10 text-green-500 hover:bg-green-500/20"
            )}
          >
            {job.remote_type === 'remote' ? 'Remote' : job.mission_type === 'individual' ? 'Particulier' : 'Entreprise'}
          </Badge>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          {job.mission_type === 'company' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{job.contract_type}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{getFormattedDate()}</span>
          </div>

          {job.budget > 0 && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Coins className="h-4 w-4 shrink-0 text-yellow-500" />
              <span>{job.budget} CAD</span>
              {job.payment_schedule && (
                <span className="text-muted-foreground">• {job.payment_schedule}</span>
              )}
            </div>
          )}
        </div>

        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {job.required_skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-primary/10">
                {skill}
              </Badge>
            ))}
            {job.required_skills.length > 3 && (
              <Badge variant="secondary" className="bg-primary/10">
                +{job.required_skills.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
