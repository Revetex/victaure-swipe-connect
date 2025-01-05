import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { JobFilters } from "../components/jobs/JobFilterUtils";
import { toast } from "sonner";

export function useSwipeJobs(filters: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch regular jobs
      let regularJobsQuery = supabase
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

      // Apply filters to regular jobs
      if (filters?.category && filters.category !== "all") {
        regularJobsQuery = regularJobsQuery.eq("category", filters.category);
      }
      if (filters?.subcategory && filters.subcategory !== "all") {
        regularJobsQuery = regularJobsQuery.eq("subcategory", filters.subcategory);
      }
      if (filters?.duration && filters.duration !== "all") {
        regularJobsQuery = regularJobsQuery.eq("contract_type", filters.duration);
      }
      if (filters?.experienceLevel && filters.experienceLevel !== "all") {
        regularJobsQuery = regularJobsQuery.eq("experience_level", filters.experienceLevel);
      }
      if (filters?.location && filters.location !== "all") {
        regularJobsQuery = regularJobsQuery.eq("location", filters.location);
      }
      if (filters?.searchTerm) {
        regularJobsQuery = regularJobsQuery.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Fetch scraped jobs
      const scrapedJobsQuery = supabase
        .from('scraped_jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      // Execute both queries in parallel
      const [regularJobsResult, scrapedJobsResult] = await Promise.all([
        regularJobsQuery,
        scrapedJobsQuery
      ]);

      if (regularJobsResult.error) {
        console.error('Error fetching regular jobs:', regularJobsResult.error);
        throw regularJobsResult.error;
      }

      if (scrapedJobsResult.error) {
        console.error('Error fetching scraped jobs:', scrapedJobsResult.error);
        throw scrapedJobsResult.error;
      }

      // Format regular jobs
      const formattedRegularJobs = (regularJobsResult.data || []).map(job => ({
        ...job,
        company: job.employer?.company_name || "Entreprise",
        salary: `${job.budget} CAD`,
        skills: job.required_skills || [],
        status: job.status as Job['status'],
      }));

      // Format scraped jobs to match Job type
      const formattedScrapedJobs = (scrapedJobsResult.data || []).map(job => ({
        id: job.id,
        title: job.title,
        description: job.description || "",
        company: job.company,
        location: job.location,
        budget: 0,
        employer_id: "",
        status: "open" as Job['status'],
        category: "Technology",
        contract_type: "full-time",
        experience_level: "mid-level",
        created_at: job.posted_at,
        company_name: job.company,
        company_website: job.url,
        is_scraped: true
      }));

      // Combine and shuffle both types of jobs
      const allJobs = [...formattedRegularJobs, ...formattedScrapedJobs]
        .sort(() => Math.random() - 0.5);

      console.log('Fetched jobs:', {
        regularJobs: formattedRegularJobs.length,
        scrapedJobs: formattedScrapedJobs.length,
        totalJobs: allJobs.length
      });

      setJobs(allJobs);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error("Impossible de charger les offres");
      setJobs([]);
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

  return {
    jobs,
    currentIndex,
    handleSwipe,
    fetchJobs,
    setCurrentIndex,
    loading
  };
}