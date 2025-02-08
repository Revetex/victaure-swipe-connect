
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { JobFilters } from "../JobFilterUtils";
import { toast } from "sonner";

export function useSwipeJobs(filters: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log("Fetching jobs with filters:", filters);
      
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

      console.log("Initial query built");

      // Apply filters only if they are set to non-default values
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
      if (filters.location && filters.location !== "") {
        query = query.eq("location", filters.location);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      console.log("Filters applied to query");

      const { data: jobsData, error: jobsError } = await query;

      console.log("Query executed, results:", { jobsData, jobsError });

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
        throw jobsError;
      }

      if (!jobsData || jobsData.length === 0) {
        console.log("No jobs found with filters, fetching recent jobs");
        setJobs([]);
      } else {
        console.log("Found jobs with filters, formatting data");
        const formattedJobs = jobsData.map(job => ({
          ...job,
          company: job.employer?.company_name || "Entreprise",
          salary: `${job.budget} CAD`,
          skills: job.required_skills || [],
          status: job.status as Job['status'],
          source: job.source || "internal"
        })) as Job[];

        console.log("Formatted jobs:", formattedJobs);
        setJobs(formattedJobs);
      }

      setCurrentIndex(0);
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      toast.error("Impossible de charger les offres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, calling fetchJobs");
    fetchJobs();
  }, [filters]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (currentIndex < jobs.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return {
    jobs,
    currentIndex,
    handleSwipe,
    fetchJobs,
    setCurrentIndex,
    loading
  };
}
