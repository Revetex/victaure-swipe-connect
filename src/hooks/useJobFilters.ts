
import { useState, useCallback } from 'react';
import { JobFilters, defaultFilters } from '@/components/jobs/JobFilterUtils';

export function useJobFilters() {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const updateFilter = useCallback((key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters
  };
}
