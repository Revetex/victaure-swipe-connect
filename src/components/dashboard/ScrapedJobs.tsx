import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, Building2, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ScrapedJob } from "@/types/database/scrapedJobs";
import { Job } from "@/types/job";

export function ScrapedJobs() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["scraped-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scraped_jobs")
        .select("*")
        .order("posted_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Convert ScrapedJob to Job format
      const formattedJobs: Job[] = (data as ScrapedJob[]).map(job => ({
        id: job.id,
        title: job.title,
        description: job.description || "",
        company: job.company,
        location: job.location,
        budget: 0, // Default value since scraped jobs might not have this
        employer_id: "", // This will be empty for scraped jobs
        status: "open",
        category: "Technology", // Default category
        contract_type: "full-time", // Default contract type
        experience_level: "mid-level", // Default experience level
        created_at: job.posted_at,
        company_name: job.company,
        company_website: job.url,
        is_scraped: true // Add this flag to identify scraped jobs
      }));

      return formattedJobs;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Emplois récents</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {jobs?.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  {job.created_at && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(job.created_at), "d MMMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  )}
                </div>
                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    <Briefcase className="h-5 w-5 text-primary" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}