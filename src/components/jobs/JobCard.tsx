
import { Building2, MapPin, Calendar, Clock, Briefcase, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface JobCardProps {
  job: Job;
  onDeleted?: () => void;
}

export function JobCard({ job, onDeleted }: JobCardProps) {
  const getFormattedDate = () => {
    try {
      const date = job.created_at ? new Date(job.created_at) : new Date();
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      return 'Date non disponible';
    }
  };

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
          
          {job.is_urgent && (
            <Badge variant="destructive">Urgent</Badge>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{job.contract_type}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{getFormattedDate()}</span>
            </div>
          </div>

          <div className="space-y-2">
            {job.experience_level && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{job.experience_level}</span>
              </div>
            )}

            {job.budget > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 shrink-0 text-yellow-500" />
                <span className="font-medium">{job.budget} CAD</span>
                {job.payment_schedule && (
                  <span className="text-muted-foreground">• {job.payment_schedule}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {(job.required_skills?.length > 0 || job.tools_and_technologies?.length > 0) && (
          <div className="border-t border-border pt-4">
            <div className="flex flex-wrap gap-2">
              {[...(job.required_skills || []), ...(job.tools_and_technologies || [])]
                .slice(0, 5)
                .map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {job.source === "external" ? (
            <Button 
              variant="outline"
              onClick={() => window.open(job.url, '_blank')}
            >
              Voir l'offre externe
            </Button>
          ) : (
            <Link to={`/jobs/${job.id}`}>
              <Button>
                Voir les détails
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
