import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Job } from "@/types/job";
import { JobFilters, applyJobFilters } from "@/components/jobs/JobFilterUtils";

export function useJobSwipe(filters: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      query = applyJobFilters(query, filters);
      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedJobs = data.map(job => ({
          id: job.id,
          title: job.title,
          company: "Company Name",
          location: job.location,
          salary: `${job.budget} CAD`,
          duration: job.contract_type,
          skills: job.required_skills || ["Skill 1", "Skill 2"],
          category: job.category,
          contract_type: job.contract_type,
          experience_level: job.experience_level
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
          const newJob = payload.new;
          setJobs(prevJobs => [{
            id: newJob.id,
            title: newJob.title,
            company: "Company Name",
            location: newJob.location,
            salary: `${newJob.budget} CAD`,
            duration: newJob.contract_type,
            skills: newJob.required_skills || ["Skill 1", "Skill 2"],
            category: newJob.category,
            contract_type: newJob.contract_type,
            experience_level: newJob.experience_level
          }, ...prevJobs]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  return {
    jobs,
    currentIndex,
    setCurrentIndex,
    fetchJobs
  };
}