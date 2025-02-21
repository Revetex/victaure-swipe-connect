
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  analysis: string;
  timestamp: string;
}

export function useCVAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeCV = async (cvContent: string, jobDescription: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: { cvContent, jobDescription }
      });

      if (error) throw error;

      setResult(data);
      return data;

    } catch (error) {
      console.error('Error analyzing CV:', error);
      toast.error("Une erreur est survenue", {
        description: "Impossible d'analyser le CV pour le moment"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    result,
    analyzeCV
  };
}
