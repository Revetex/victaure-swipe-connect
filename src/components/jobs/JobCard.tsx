
import { motion } from "framer-motion";
import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Calendar, Briefcase, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onClick?: (job: Job) => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Non spécifié";
    if (min && max) {
      return `${min.toLocaleString('fr-FR')}$ - ${max.toLocaleString('fr-FR')}$`;
    }
    return `${(min || max || 0).toLocaleString('fr-FR')}$`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        onClick={() => onClick?.(job)}
        className={`
          p-6 cursor-pointer transition-all duration-300
          hover:shadow-lg hover:border-primary/20
          ${isSelected ? 'border-primary/30 shadow-lg bg-primary/5' : ''}
        `}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-tight">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span>{job.company || "Entreprise non spécifiée"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {job.contract_type || "Non spécifié"}
            </Badge>
            {job.remote_type && (
              <Badge 
                variant={job.remote_type === "full" ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {job.remote_type === "full" ? "Full Remote" : "Hybride"}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {(job.salary_min || job.salary_max) && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                </div>
              )}
              {job.created_at && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDistanceToNow(new Date(job.created_at), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
