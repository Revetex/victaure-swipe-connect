
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapPin, Building2, Calendar, Briefcase } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  selectedJobId?: string;
  onResetFilters: () => void;
}

export function JobsResults({ 
  jobs,
  onJobSelect,
  selectedJobId,
  onResetFilters
}: JobsResultsProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Aucun emploi trouvé</h3>
        <p className="text-muted-foreground mb-6">Essayez de modifier vos critères de recherche</p>
        <button 
          onClick={onResetFilters}
          className="text-primary hover:underline"
        >
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {jobs.length} {jobs.length === 1 ? 'emploi trouvé' : 'emplois trouvés'}
      </p>
      
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`p-6 cursor-pointer hover:shadow-md transition-shadow ${
                selectedJobId === job.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onJobSelect(job)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(job.created_at || new Date()), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{job.company || 'Entreprise non spécifiée'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span>{job.contract_type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{job.experience_level}</span>
                  </div>
                </div>

                {(job.salary_min || job.salary_max) && (
                  <div className="text-sm font-medium text-primary">
                    {job.salary_min && job.salary_max 
                      ? `${job.salary_min}$ - ${job.salary_max}$`
                      : job.salary_min 
                        ? `À partir de ${job.salary_min}$`
                        : `Jusqu'à ${job.salary_max}$`
                    }
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
