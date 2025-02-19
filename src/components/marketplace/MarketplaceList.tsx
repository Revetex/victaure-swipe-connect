
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useSmartJobAnalysis } from "@/hooks/useSmartJobAnalysis";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string | null;
  location: string | null;
  salary_range: string | null;
  url: string;
  skills: string[] | null;
  match_score: number | null;
  posted_at: string;
}

export function MarketplaceList() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { analyzeJobs, isAnalyzing } = useSmartJobAnalysis();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .order('match_score', { ascending: false })
        .order('posted_at', { ascending: false });

      if (error) throw error;
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error("Erreur lors du chargement des offres d'emploi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeJobs = async () => {
    try {
      await analyzeJobs();
      await fetchJobs();
      toast.success("Analyse des offres terminée");
    } catch (error) {
      console.error('Error analyzing jobs:', error);
      toast.error("Erreur lors de l'analyse des offres");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] w-full">
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-4">
          <h2 className="text-2xl font-bold">Offres d'emploi</h2>
          <Button 
            onClick={handleAnalyzeJobs} 
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
            Analyser les offres
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                {job.match_score && (
                  <span className="ml-4 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm whitespace-nowrap">
                    {job.match_score}% match
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4">
                {job.description && (
                  <p className="text-sm line-clamp-3">{job.description}</p>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground space-x-2">
                  {job.location && <span className="truncate">{job.location}</span>}
                  {job.salary_range && (
                    <>
                      <span>•</span>
                      <span className="truncate">{job.salary_range}</span>
                    </>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Publié le {new Date(job.posted_at).toLocaleDateString()}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  Postuler
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Aucune offre d'emploi trouvée</p>
            <Button 
              variant="outline"
              onClick={handleAnalyzeJobs}
              disabled={isAnalyzing}
            >
              Lancer une analyse
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
