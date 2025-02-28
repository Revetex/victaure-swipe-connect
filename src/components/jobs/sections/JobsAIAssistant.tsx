
import { useState } from 'react';
import { Job } from '@/types/job';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, UserRound, BriefcaseIcon, MessagesSquare, ArrowRight, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

    if (jobs.length === 0) {
      toast.warning("Aucune offre à analyser. Veuillez ajuster vos filtres.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const jobsContext = jobs.slice(0, 5).map(job => ({
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
      toast.success("Analyse complétée avec succès!");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="sticky top-20 bg-card dark:bg-[#1B2A4A]/50 backdrop-blur-sm border-border/10 dark:border-[#64B5D9]/10 rounded-lg shadow-lg overflow-hidden h-fit">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Assistant IA d'emploi</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {!analysis ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <UserRound className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Analyse de profil</p>
                <p className="text-xs text-muted-foreground">Évaluation de vos compétences et expériences</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <BriefcaseIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Match d'offres</p>
                <p className="text-xs text-muted-foreground">Compatibilité avec les offres affichées</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <MessagesSquare className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Conseils personnalisés</p>
                <p className="text-xs text-muted-foreground">Recommandations pour améliorer vos chances</p>
              </div>
            </div>
            
            <Badge variant="outline" className="w-full justify-center py-1.5 gap-1 mt-2">
              {jobs.length} offres disponibles pour analyse
            </Badge>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-3">
              {analysis.split('\n\n').map((paragraph, index) => (
                <div key={index} className="text-sm">
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <p key={`${index}-${lineIndex}`} className={cn(
                      "mb-1",
                      line.startsWith("•") && "pl-4"
                    )}>
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex justify-center border-t border-border/10 mt-2">
        <Button
          onClick={analyzeJobs}
          disabled={isAnalyzing || jobs.length === 0}
          className="w-full"
          variant={analysis ? "outline" : "default"}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : analysis ? (
            <>Actualiser l'analyse</>
          ) : (
            <>
              Analyser les offres
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
