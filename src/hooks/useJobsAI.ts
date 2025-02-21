
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseJobsAIProps {
  userProfile?: any;
  jobContext?: any;
}

export function useJobsAI({ userProfile, jobContext }: UseJobsAIProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const askAssistant = async (query: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jobs-ai-assistant', {
        body: {
          query,
          userProfile,
          jobContext
        }
      });

      if (error) throw error;

      setResponse(data.response);
      return data.response;

    } catch (error) {
      console.error('Error asking assistant:', error);
      toast.error("Une erreur est survenue", {
        description: "Impossible de contacter l'assistant pour le moment"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    response,
    askAssistant
  };
}
