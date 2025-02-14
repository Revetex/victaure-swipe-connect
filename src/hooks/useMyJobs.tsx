
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { toast } from 'sonner';

export function useMyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos offres");
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(
            full_name,
            company_name,
            avatar_url
          )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedJobs = data.map(job => ({
        ...job,
        company: job.employer?.company_name || "Entreprise",
        salary: `${job.budget} CAD`,
        skills: job.required_skills || [],
        status: job.status as Job['status'],
        source: job.source || "internal"
      })) as Job[];

      setJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error("Erreur lors du chargement des offres");
    }
  }, []);

  return { jobs, fetchJobs };
}
