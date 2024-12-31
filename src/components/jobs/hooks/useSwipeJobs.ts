import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";

export function useSwipeJobs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { 
    data: jobs = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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

      if (error) throw error;

      return data.map(job => ({
        ...job,
        company: job.employer?.company_name || "Entreprise",
        salary: `${job.budget} CAD`,
        skills: job.required_skills || [],
        status: job.status as Job['status']
      })) as Job[];
    }
  });

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      toast.info("Vous êtes au début de la liste");
    }
  };

  const handleNext = () => {
    if (currentIndex < (jobs?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("Vous êtes à la fin de la liste");
    }
  };

  return {
    jobs,
    currentIndex,
    isLoading,
    error,
    refetch,
    handlePrevious,
    handleNext
  };
}