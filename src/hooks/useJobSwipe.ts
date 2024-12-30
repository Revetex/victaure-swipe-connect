import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Job } from "@/types/job";
import { JobFilters, applyJobFilters } from "@/components/jobs/JobFilterUtils";

export function useJobSwipe(filters: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("jobs")
        .select("*")
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      // Apply filters only for existing columns
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.subcategory && filters.subcategory !== 'all') {
        query = query.eq('subcategory', filters.subcategory);
      }

      if (filters.location && filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }

      if (filters.experienceLevel && filters.experienceLevel !== 'all') {
        query = query.eq('experience_level', filters.experienceLevel);
      }

      console.log("Fetching jobs with filters:", filters);
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Erreur lors du chargement des offres");
        return;
      }

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
          subcategory: job.subcategory,
          skills: job.required_skills || [],
          employer_id: job.employer_id,
          description: job.description,
          budget: job.budget,
          status: job.status,
          created_at: job.created_at,
          updated_at: job.updated_at
        }));
        console.log("Formatted jobs:", formattedJobs);
        setJobs(formattedJobs);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error in fetchJobs:", error);
      toast.error("Erreur lors du chargement des offres");
    } finally {
      setIsLoading(false);
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
            subcategory: newJob.subcategory,
            skills: newJob.required_skills || [],
            employer_id: newJob.employer_id,
            description: newJob.description,
            budget: newJob.budget,
            status: newJob.status,
            created_at: newJob.created_at,
            updated_at: newJob.updated_at
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
    fetchJobs,
    isLoading
  };
}