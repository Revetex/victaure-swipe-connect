
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useJobScraping() {
  const [isLoading, setIsLoading] = useState(false);

  const scrapeJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs');
      
      if (error) throw error;

      toast.success('Nouvelles offres trouvées !', {
        description: `${data.jobs.length} offres ont été ajoutées`
      });

      return data.jobs;
    } catch (error) {
      console.error('Error scraping jobs:', error);
      toast.error('Erreur lors de la recherche', {
        description: "Impossible de récupérer les offres pour le moment"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    scrapeJobs
  };
}
