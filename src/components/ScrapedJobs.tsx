
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source_platform: string;
  posted_at: string;
}

export function ScrapedJobs() {
  const [jobs, setJobs] = useState<ScrapedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error("Erreur lors du chargement des emplois");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return <div>Chargement des offres d'emploi...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Offres d'emploi récentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold line-clamp-2">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📍 {job.location}</span>
                <span>• {new Date(job.posted_at).toLocaleDateString()}</span>
              </div>
              
              <p className="text-sm line-clamp-3">{job.description}</p>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  via {job.source_platform}
                </span>
                <Button 
                  size="sm"
                  onClick={() => handleApply(job.url)}
                >
                  Postuler
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
