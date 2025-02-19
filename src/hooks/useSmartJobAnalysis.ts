
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from './useProfile';

interface JobMatch {
  job_id: string;
  score: number;
  reasons: string[];
}

export function useSmartJobAnalysis() {
  const { profile } = useProfile();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJobs = useCallback(async () => {
    if (!profile) {
      toast.error("Vous devez être connecté pour analyser les offres d'emploi");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke<{ data: JobMatch[] }>('smart-job-scraper', {
        body: { user_id: profile.id }
      });

      if (error) throw error;

      toast.success("Analyse des offres d'emploi terminée !");
      return data;

    } catch (error) {
      console.error('Erreur lors de l\'analyse des emplois:', error);
      toast.error("Une erreur est survenue lors de l'analyse des offres d'emploi");
    } finally {
      setIsAnalyzing(false);
    }
  }, [profile]);

  return {
    analyzeJobs,
    isAnalyzing
  };
}
