
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceService } from "@/types/marketplace";
import { useSmartJobAnalysis } from "@/hooks/useSmartJobAnalysis";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MarketplaceList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { analyzeJobs, isAnalyzing } = useSmartJobAnalysis();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('match_score', { ascending: false })
        .order('posted_at', { ascending: false });

      if (error) throw error;
      
      // Dédupliquer les offres en utilisant l'ID
      const uniqueJobs = data ? Array.from(new Map(data.map(job => [job.id, job])).values()) : [];
      setJobs(uniqueJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeJobs = async () => {
    await analyzeJobs();
    fetchJobs();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] w-full px-4">
      <div className="max-w-7xl mx-auto">
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
                    {Math.round(job.match_score)}% match
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-sm line-clamp-3">{job.description}</p>
                
                <div className="flex items-center text-sm text-muted-foreground space-x-2">
                  <span className="truncate">{job.location}</span>
                  {job.salary_range && (
                    <>
                      <span>•</span>
                      <span className="truncate">{job.salary_range}</span>
                    </>
                  )}
                </div>

                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill: string, index: number) => (
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
