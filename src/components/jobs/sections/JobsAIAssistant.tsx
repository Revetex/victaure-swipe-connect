
import { useState } from 'react';
import { Job } from '@/types/job';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface JobsAIAssistantProps {
  jobs: Job[];
}

export function JobsAIAssistant({
  jobs
}: JobsAIAssistantProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const {
    profile
  } = useProfile();

  const analyzeJobs = async () => {
    if (!profile) {
      toast.error("Veuillez vous connecter pour utiliser l'assistant IA");
      return;
    }

    setIsAnalyzing(true);
    try {
      const jobsContext = jobs.map(job => ({
        title: job.title,
        company: job.company,
        description: job.description,
        skills: job.required_skills,
        salary: job.salary_max || job.salary_min
      }));

      const userContext = {
        skills: profile.skills || [],
        experience: profile.experiences || [],
        education: profile.education || []
      };

      const response = await fetch('https://mfjllillnpleasclqabb.supabase.co/functions/v1/analyze-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobs: jobsContext,
          userProfile: userContext
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-card dark:bg-[#1B2A4A]/50 backdrop-blur-sm border-border/10 dark:border-[#64B5D9]/10 rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#1B2A4A]/70 to-[#2C3E50]/70 dark:from-[#1B2A4A] dark:to-[#2C3E50] text-white">
          <Sparkles className="h-10 w-10 mb-4 text-[#64B5D9]" />
          <h2 className="text-xl font-semibold mb-3 text-center">Assistant IA</h2>
          <p className="text-sm text-center mb-4 text-gray-200">
            Analysez les offres d'emploi affichées et obtenez des recommandations personnalisées pour maximiser vos chances.
          </p>
          <Button 
            onClick={analyzeJobs} 
            disabled={isAnalyzing || jobs.length === 0}
            className="w-full bg-[#64B5D9] hover:bg-[#4A90E2] text-white transition-colors"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser les offres'}
          </Button>
        </div>
        
        <div className="w-full md:w-2/3 p-6">
          {analysis ? (
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2 dark:text-white">
                <MessageCircle className="h-5 w-5 text-[#64B5D9]" />
                Résultats de l'analyse
              </h3>
              <ScrollArea className="flex-1 max-h-[300px]">
                <div className="prose prose-sm dark:prose-invert">
                  {analysis.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 text-sm dark:text-gray-200">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t border-border/10 dark:border-[#64B5D9]/10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => analyzeJobs()}
                  disabled={isAnalyzing}
                  className="text-xs"
                >
                  Actualiser l'analyse
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-lg font-medium dark:text-white">Obtenez des conseils personnalisés</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Cliquez sur "Analyser les offres" pour recevoir une analyse détaillée des opportunités affichées et des conseils adaptés à votre profil.
              </p>
              {jobs.length === 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-4">
                  Aucune offre d'emploi affichée. Ajustez vos filtres pour voir des offres.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
