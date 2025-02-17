
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";
import type { JobFilters } from "@/types/filters";
import { MotionValue, useMotionValue, useAnimation } from "framer-motion";

interface SwipeJobsResult {
  jobs: Job[];
  loading: boolean;
  currentIndex: number;
  handleSwipe: (direction: string) => void;
  fetchJobs: () => Promise<void>;
  setCurrentIndex: (index: number) => void;
  swipeDirection: string;
  isDragging: boolean;
  isAnimating: boolean;
  x: MotionValue<number>;
  rotate: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  background: MotionValue<string>;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  handleButtonSwipe: (direction: 'left' | 'right') => void;
}

export function useSwipeJobs(filters: JobFilters): SwipeJobsResult {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  const opacity = useMotionValue(1);
  const scale = useMotionValue(1);
  const background = useMotionValue('transparent');

  const { data: jobs = [], isLoading: loading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query;
      
      if (filters.source === 'marketplace') {
        // Pour le marketplace, utiliser la table marketplace_jobs
        const { data, error } = await supabase
          .from('marketplace_jobs')
          .select(`
            *,
            employer:profiles(full_name, avatar_url)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as unknown as Job[];
      } else if (filters.source === 'external') {
        // Pour les jobs externes, utiliser scraped_jobs
        const { data, error } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('posted_at', { ascending: false });

        if (error) throw error;
        return data as unknown as Job[];
      } else {
        // Pour les jobs réguliers, utiliser la table jobs
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

  const handleDragStart = () => {
    setIsDragging(true);
    setIsAnimating(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const xValue = x.get();
    if (Math.abs(xValue) > 100) {
      setSwipeDirection(xValue > 0 ? 'right' : 'left');
      handleSwipe(xValue > 0 ? 'right' : 'left');
    }
    x.set(0);
    rotate.set(0);
  };

  const handleSwipe = (direction: string) => {
    if (direction === 'right') {
      console.log('Swiped right on job:', jobs[currentIndex]);
    }
    setCurrentIndex(prev => Math.min(prev + 1, jobs.length - 1));
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    handleSwipe(direction);
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
    setCurrentIndex,
    swipeDirection,
    isDragging,
    isAnimating,
    x,
    rotate,
    opacity,
    scale,
    background,
    handleDragStart,
    handleDragEnd,
    handleButtonSwipe
  };
}
