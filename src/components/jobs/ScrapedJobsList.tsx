
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ScrapedJob } from "@/types/database/scrapedJobs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ScrapedJobsListProps {
  queryString?: string;
}

export function ScrapedJobsList({ queryString = "" }: ScrapedJobsListProps) {
  const navigate = useNavigate();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["all-jobs", queryString],
    queryFn: async () => {
      // Récupérer les emplois externes
      const { data: scrapedJobs = [] } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      // Récupérer les emplois Victaure
      const { data: victaureJobs = [] } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(
            company_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // Formater tous les emplois de manière uniforme
      const formattedJobs = [
        ...scrapedJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          posted_at: job.posted_at,
          source: 'Externe'
        })),
        ...victaureJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.employer?.company_name || 'Entreprise',
          location: job.location,
          url: `/jobs/${job.id}`,
          posted_at: job.created_at,
          source: 'Victaure'
        }))
      ];

      // Filtrer si une recherche est présente
      if (queryString) {
        return formattedJobs.filter(job => 
          job.title.toLowerCase().includes(queryString.toLowerCase()) ||
          job.company.toLowerCase().includes(queryString.toLowerCase()) ||
          job.location.toLowerCase().includes(queryString.toLowerCase())
        );
      }

      return formattedJobs;
    }
  });

  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-6"
      >
        <div className="flex justify-between items-center p-4 bg-card rounded-lg">
          <h2 className="text-2xl font-semibold">
            Offres d'emploi ({jobs.length})
          </h2>
          
          <Button
            onClick={handleCreateJob}
            className="bg-primary hover:bg-primary/90"
          >
            Publier une offre
          </Button>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune offre disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(job.posted_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button 
                      variant="default"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Voir l'offre
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
