
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";
import type { JobFilters } from "@/types/filters";

interface SwipeJobsResult {
  jobs: Job[];
  loading: boolean;
  currentIndex: number;
  handleSwipe: (direction: string) => void;
  fetchJobs: () => Promise<void>;
  setCurrentIndex: (index: number) => void;
}

export function useSwipeJobs(filters: JobFilters): SwipeJobsResult {
  const { data: jobs = [], isLoading: loading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      if (filters.source === 'external') {
        const { data, error } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('posted_at', { ascending: false });

        if (error) throw error;
        return data as unknown as Job[];
      } else {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Job[];
      }
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: string) => {
    if (direction === 'right') {
      console.log('Swiped right on job:', jobs[currentIndex]);
    }
    setCurrentIndex(prev => Math.min(prev + 1, jobs.length - 1));
  };

  const fetchJobs = async () => {
    try {
      await supabase.functions.invoke('smart-job-scraper');
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return {
    jobs,
    loading,
    currentIndex,
    handleSwipe,
    fetchJobs,
    setCurrentIndex
  };
}
