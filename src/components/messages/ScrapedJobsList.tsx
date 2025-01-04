import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrapedJob } from "@/types/database/scrapedJobs";
import { Skeleton } from "@/components/ui/skeleton";

interface ScrapedJobsListProps {
  jobs: ScrapedJob[];
  isLoading: boolean;
}

export function ScrapedJobsList({ jobs, isLoading }: ScrapedJobsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune offre disponible</h3>
        <p className="text-sm text-muted-foreground">
          Les nouvelles offres apparaîtront ici dès qu'elles seront disponibles
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(job.posted_at), "d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                asChild
              >
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  Voir l'offre
                </a>
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}