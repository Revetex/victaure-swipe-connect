
import { Job } from "@/types/job";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  CalendarDays
} from "lucide-react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobListProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
  selectedJobId?: string;
}

export function JobList({ jobs, onJobSelect, selectedJobId }: JobListProps) {
  const isMobile = useIsMobile();

  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Briefcase className="h-12 w-12 text-muted-foreground/50" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Aucun emploi trouvé</h3>
          <p className="text-sm text-muted-foreground">
            Essayez de modifier vos filtres ou revenez plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "group relative bg-card hover:bg-muted/50",
            "border rounded-lg overflow-hidden transition-all",
            "cursor-pointer shadow-sm hover:shadow-md",
            selectedJobId === job.id && "ring-2 ring-primary",
            isMobile ? "p-4" : "p-6"
          )}
          onClick={() => onJobSelect?.(job)}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium leading-none group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company_name}</span>
                </div>
              </div>

              <div className="shrink-0">
                <Badge variant={job.contract_type === 'FULL_TIME' ? 'default' : 'secondary'}>
                  {job.contract_type === 'FULL_TIME' ? 'Temps plein' : 'Temps partiel'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDistance(new Date(job.created_at || new Date()), new Date(), {
                    addSuffix: true,
                    locale: fr
                  })}
                </span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              )}

              {job.experience_level && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{job.experience_level}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skills?.slice(0, isMobile ? 3 : 5).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {job.skills?.length > (isMobile ? 3 : 5) && (
                <Badge variant="outline">
                  +{job.skills.length - (isMobile ? 3 : 5)}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Sauvegarder
              </Button>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Postuler
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
