
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceService } from "@/types/marketplace";
import { useSmartJobAnalysis } from "@/hooks/useSmartJobAnalysis";
import { Loader2 } from "lucide-react";

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
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeJobs = async () => {
    await analyzeJobs();
    fetchJobs(); // Rafraîchir la liste après l'analyse
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
              {job.match_score && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {Math.round(job.match_score)}% match
                </span>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm">{job.description?.slice(0, 150)}...</p>
              
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <span>{job.location}</span>
                {job.salary_range && (
                  <>
                    <span>•</span>
                    <span>{job.salary_range}</span>
                  </>
                )}
              </div>

              {job.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
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

            <div className="pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">
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
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune offre d'emploi trouvée</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleAnalyzeJobs}
            disabled={isAnalyzing}
          >
            Lancer une analyse
          </Button>
        </div>
      )}
    </div>
  );
}
