
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
      <div className="flex items-center justify-center p-8 backdrop-blur-sm bg-background/50 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-medium text-muted-foreground">Chargement des offres...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#6E59A5]">
            Offres externes ({jobs.length})
          </h2>
        </div>
        
        {jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-muted/50 backdrop-blur-sm rounded-lg p-8 text-center"
          >
            <p className="text-lg font-medium text-muted-foreground">
              Aucune offre disponible pour le moment
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/50 border-border/50">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 font-montserrat">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 text-[#9b87f5]" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-[#9b87f5]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-[#9b87f5]" />
                        <span>
                          {formatDistanceToNow(new Date(job.posted_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-[#9b87f5] hover:bg-[#8A76F3] rounded-lg transition-colors duration-200"
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
      </motion.div>
    </div>
  );
}
