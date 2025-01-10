import { Job } from "@/types/job";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase,
  ExternalLink,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  url?: string;
}

export function JobCard({ 
  job, 
  onApply, 
  onDelete, 
  showActions = true,
  url 
}: JobCardProps) {
  const formattedDate = formatDistanceToNow(new Date(job.created_at), {
    addSuffix: true,
    locale: fr
  });

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <Badge variant={job.source === 'Victaure' ? 'default' : 'secondary'}>
            {job.source || 'Victaure'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{job.contract_type}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          {job.budget > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.budget} CAD</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-4">
            {job.url ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(job.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir l'offre
              </Button>
            ) : (
              <>
                {onApply && (
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={onApply}
                  >
                    Postuler
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="destructive"
                    onClick={onDelete}
                  >
                    Supprimer
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}