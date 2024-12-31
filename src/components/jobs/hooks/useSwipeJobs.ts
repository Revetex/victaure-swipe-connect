import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job, JobStatus } from "@/types/job";
import { JobFilters } from "../JobFilterUtils";
import { toast } from "sonner";

export function useSwipeJobs(filters: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(
            full_name,
            company_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.subcategory && filters.subcategory !== "all") {
        query = query.eq("subcategory", filters.subcategory);
      }
      if (filters.duration && filters.duration !== "all") {
        query = query.eq("contract_type", filters.duration);
      }
      if (filters.experienceLevel && filters.experienceLevel !== "all") {
        query = query.eq("experience_level", filters.experienceLevel);
      }
      if (filters.location && filters.location !== "all") {
        query = query.eq("location", filters.location);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Format jobs with virtual fields
      const formattedJobs = data.map(job => ({
        ...job,
        company: job.employer?.company_name || "Entreprise",
        salary: `${job.budget} CAD`,
        skills: job.required_skills || [],
        status: job.status as JobStatus,
      }));

      setJobs(formattedJobs);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err as Error);
      toast.error("Impossible de charger les offres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (currentIndex < jobs.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentJob = jobs[currentIndex];

  return {
    jobs,
    currentJob,
    currentIndex,
    handleSwipe,
    fetchJobs,
    setCurrentIndex,
    loading,
    error
  };
}