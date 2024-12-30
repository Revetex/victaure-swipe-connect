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
          category: job.category,
          contract_type: job.contract_type,
          experience_level: job.experience_level,
          skills: job.required_skills || ["Skill 1", "Skill 2"],
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
            category: newJob.category,
            contract_type: newJob.contract_type,
            experience_level: newJob.experience_level,
            skills: newJob.required_skills || ["Skill 1", "Skill 2"],
          }, ...prevJobs]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (direction === "right") {
      try {
        const { data: profile } = await supabase.auth.getUser();
        if (profile.user) {
          const { error } = await supabase.from("matches").insert({
            job_id: jobs[currentIndex].id,
            professional_id: profile.user.id,
            status: "pending"
          });

          if (error) throw error;
          toast.success("Match! Vous avez liké cette offre", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error creating match:", error);
        toast.error("Erreur lors de la création du match");
      }
    }

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