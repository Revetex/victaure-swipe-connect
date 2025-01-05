import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, MapPin, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

export function ScrapedJobsList() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["scraped-jobs"],
    queryFn: async () => {
      console.log("Fetching scraped jobs...");
      const { data, error } = await supabase
        .from("scraped_jobs")
        .select("*")
        .order("posted_at", { ascending: false });

      if (error) {
        console.error("Error fetching scraped jobs:", error);
        toast.error("Erreur lors du chargement des offres externes");
        throw error;
      }

      console.log("Fetched scraped jobs:", data);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const refreshJobs = async () => {
    try {
      const { error } = await supabase.functions.invoke("scrape-jobs");
      if (error) throw error;
      toast.success("Les offres ont été mises à jour");
    } catch (error) {
      console.error("Error refreshing jobs:", error);
      toast.error("Erreur lors de la mise à jour des offres");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Offres externes ({jobs.length})</h2>
        <Button onClick={refreshJobs} variant="outline" size="sm">
          Rafraîchir les offres
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{job.title}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {job.source}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>

                  {job.posted_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(job.posted_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  )}
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

      {jobs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucune offre trouvée. Cliquez sur Rafraîchir pour chercher de nouvelles offres.
        </div>
      )}
    </div>
  );
}