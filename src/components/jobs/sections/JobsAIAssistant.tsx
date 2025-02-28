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
  return;
}