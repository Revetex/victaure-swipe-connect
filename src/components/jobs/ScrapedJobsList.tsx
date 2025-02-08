
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  url?: string;
  posted_at: string;
  created_at: string;
  updated_at: string;
}

export function ScrapedJobsList() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["scraped-jobs"],
    queryFn: async () => {
      console.log("Fetching scraped jobs...");
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) {
        console.error("Error fetching scraped jobs:", error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} scraped jobs`);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Chargement des offres...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Offres externes ({jobs.length})</h2>
        </div>
        
        {jobs.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Aucune offre disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 h-full flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(job.posted_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir l'offre
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
