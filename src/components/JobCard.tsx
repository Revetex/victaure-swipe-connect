import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, ExternalLink, MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: any;
  showActions?: boolean;
  className?: string;
  url?: string;
}

export function JobCard({ job, showActions = true, className, url }: JobCardProps) {
  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-2">{job.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.company || job.company_name || 'Entreprise'}</span>
              </div>
            </div>
            <Badge 
              variant={job.source === 'Victaure' ? 'default' : 'secondary'}
              className="self-start flex-shrink-0"
            >
              {job.source || 'Victaure'}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              {job.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{job.location}</span>
                </div>
              )}
              
              {job.budget && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.budget} CAD</span>
                </div>
              )}
            </div>

            {job.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>
            )}
          </div>

          {showActions && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              {url ? (
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir l'offre
                </Button>
              ) : null}
              
              <Button className="w-full sm:w-auto">
                Postuler
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}