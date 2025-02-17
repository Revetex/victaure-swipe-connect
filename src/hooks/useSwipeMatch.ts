
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSwipeJobs } from '@/components/jobs/swipe/useSwipeJobs';
import type { JobFilters } from '@/types/filters';

export function useSwipeMatch() {
  const filters: JobFilters = {
    source: 'internal',
    urgent: false
  };

  const { jobs, loading, currentIndex, handleSwipe } = useSwipeJobs(filters);

  return {
    jobs,
    loading,
    currentIndex,
    handleSwipe
  };
}
