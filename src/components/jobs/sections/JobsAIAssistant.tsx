
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

export function JobsAIAssistant({ jobs }: JobsAIAssistantProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { profile } = useProfile();

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
        salary: job.salary_max || job.salary_min,
      }));

      const userContext = {
        skills: profile.skills || [],
        experience: profile.experiences || [],
        education: profile.education || [],
      };

      const response = await fetch('https://mfjllillnpleasclqabb.supabase.co/functions/v1/analyze-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobs: jobsContext,
          userProfile: userContext,
        }),
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
    <Card className="bg-card dark:bg-[#1B2A4A]/50 backdrop-blur-sm border-border/10 dark:border-[#64B5D9]/10 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground dark:text-white flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Assistant IA
        </h2>
        <Button
          onClick={analyzeJobs}
          disabled={isAnalyzing || jobs.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Analyser les offres
        </Button>
      </div>

      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : analysis ? (
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br>') }} />
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            Cliquez sur "Analyser les offres" pour obtenir des recommandations personnalisées
          </p>
        )}
      </ScrollArea>
    </Card>
  );
}
