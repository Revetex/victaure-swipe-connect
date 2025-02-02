import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, MapPin, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function ScrapedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les emplois",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshJobs = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Mise à jour",
        description: "Recherche de nouveaux emplois en cours...",
      });

      const { error } = await supabase.functions.invoke('smart-job-scraper');
      if (error) throw error;
      
      await fetchJobs();
      toast({
        title: "Succès",
        description: "Les emplois ont été mis à jour avec l'IA"
      });
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les emplois",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Emplois récents</h2>
        <Button 
          onClick={refreshJobs} 
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Recherche...
            </>
          ) : (
            <>
              <Briefcase className="h-4 w-4" />
              Chercher des emplois
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow h-full">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{job.title}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(job.posted_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{job.location}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(job.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir l'offre
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {jobs.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun emploi trouvé. Cliquez sur "Chercher des emplois" pour trouver de nouvelles offres.
        </div>
      )}
    </div>
  );
}