import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { JobFilters, applyJobFilters } from "../JobFilterUtils";

export function useSwipeJobs(filters: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir les offres");
        return;
      }

      let query = supabase
        .from("jobs")
        .select(`
          *,
          employer:profiles!jobs_employer_id_fkey (
            company_name,
            full_name
          )
        `)
        .eq('status', 'open')
        .neq('employer_id', user.id)
        .order('created_at', { ascending: false });

      query = applyJobFilters(query, filters);

      // Exclude jobs user has already matched with
      const { data: matchedJobs } = await supabase
        .from('matches')
        .select('job_id')
        .eq('professional_id', user.id);

      if (matchedJobs && matchedJobs.length > 0) {
        const matchedJobIds = matchedJobs.map(match => match.job_id);
        query = query.not('id', 'in', `(${matchedJobIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedJobs = data.map(job => ({
          ...job,
          company: job.employer?.company_name || job.employer?.full_name || "Entreprise",
          salary: `${job.budget} CAD`,
          skills: job.required_skills || [],
        }));
        setJobs(formattedJobs);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Erreur lors du chargement des offres");
    }
  };

  useEffect(() => {
    fetchJobs();

    // Subscribe to new jobs
    const channel = supabase
      .channel('public:jobs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          console.log('Nouvelle mission reçue:', payload);
          const newJob = payload.new as Job;
          setJobs(prevJobs => [{
            ...newJob,
            company: "Nouvelle entreprise",
            salary: `${newJob.budget} CAD`,
            skills: newJob.required_skills || [],
            // Ensure all required Job properties are present
            title: newJob.title,
            location: newJob.location,
            category: newJob.category,
            contract_type: newJob.contract_type,
            experience_level: newJob.experience_level,
          }, ...prevJobs]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      toast.info("Plus d'offres disponibles pour le moment", {
        position: "top-center",
      });
    }
  };

  return {
    jobs,
    currentIndex,
    handleSwipe,
    fetchJobs,
    setCurrentIndex
  };
}