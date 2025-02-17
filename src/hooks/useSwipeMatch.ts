
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSwipeJobs } from '@/components/jobs/swipe/useSwipeJobs';
import type { JobFilters } from '@/types/filters';
import { MotionValue, useMotionValue } from 'framer-motion';

export function useSwipeMatch(onMatchSuccess?: (jobId: string) => Promise<void>) {
  const filters: JobFilters = {
    source: 'internal',
    urgent: false
  };

  const {
    jobs,
    loading,
    currentIndex,
    handleSwipe,
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
    handleButtonSwipe,
    fetchJobs,
    setCurrentIndex
  } = useSwipeJobs(filters);

  return {
    jobs,
    loading,
    currentIndex,
    handleSwipe,
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
    handleButtonSwipe,
    fetchJobs,
    setCurrentIndex
  };
}
