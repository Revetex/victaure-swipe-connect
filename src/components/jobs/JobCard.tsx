
import { Card } from "@/components/ui/card";
import { Building2, MapPin, ExternalLink, Import } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { UnifiedJob } from "@/types/jobs/types";
import { toast } from "sonner";

interface JobCardProps {
  job: UnifiedJob;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const navigate = useNavigate();

  const handleImportJob = () => {
    // Préparer les données pour le formulaire de création
    const jobData = {
      title: job.title,
      company_name: job.company,
      location: job.location,
      description: job.description || job.transcription || "",
      mission_type: "company",
      category: "Technology", // Par défaut, peut être amélioré avec une IA de classification
      contract_type: "full-time", // Par défaut
      experience_level: "mid-level", // Par défaut
      budget: 0, // À définir par l'utilisateur
      required_skills: [], // À extraire du texte avec une IA
      remote_type: "on-site", // Par défaut
    };

    // Stocker les données dans le localStorage pour les récupérer dans le formulaire
    localStorage.setItem('import_job_data', JSON.stringify(jobData));
    
    // Rediriger vers le formulaire de création
    navigate('/jobs/create');
    
    toast.success("Les données de l'offre ont été importées");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {job.logo_url && (
              <img 
                src={job.logo_url} 
                alt={`Logo de ${job.company}`}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
              {job.source}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-lg line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{job.location}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(job.posted_at), {
                addSuffix: true,
                locale: fr
              })}
            </div>
          </div>

          {job.transcription && (
            <div className="mt-4 text-sm text-muted-foreground line-clamp-3">
              {job.transcription}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {job.source === 'Externe' && (
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleImportJob}
              title="Importer cette offre sur Victaure"
            >
              <Import className="h-4 w-4" />
              Importer l'offre
            </Button>
          )}
          
          <Button 
            variant="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.open(job.url, '_blank')}
            title={`Voir l'offre pour ${job.title} chez ${job.company}`}
            aria-label={`Voir l'offre pour ${job.title} chez ${job.company}`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Voir l'offre
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
