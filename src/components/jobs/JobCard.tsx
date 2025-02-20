
import { Job } from "@/types/job";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Building2, MapPin, Timer } from "lucide-react";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onClick?: (job: Job) => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const handleClick = () => {
    if (onClick) onClick(job);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer border transition-all duration-200",
          "hover:shadow-lg hover:border-primary/20",
          "active:scale-[0.99] active:shadow-sm",
          isSelected && "ring-2 ring-primary ring-offset-2",
          "backdrop-blur-sm bg-card/95"
        )}
        onClick={handleClick}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-xl text-balance line-clamp-2 flex-1">
                {job.title}
              </h3>
              <Badge 
                variant={job.source === "internal" ? "default" : "secondary"}
                className="shrink-0"
              >
                {job.source === "internal" ? "Victaure" : "Externe"}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {job.company && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
              )}
              
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
              
              {job.created_at && (
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
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

          {/* Content */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{job.contract_type}</Badge>
              <Badge variant="outline">{job.experience_level}</Badge>
              {job.salary_min && job.salary_max && (
                <Badge variant="outline">
                  {job.salary_min.toLocaleString()}€ - {job.salary_max.toLocaleString()}€
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 text-primary hover:text-primary/80"
            >
              Voir l'offre
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
