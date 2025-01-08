import { useState, useCallback } from 'react';
import { JobFilters, defaultFilters } from '@/components/jobs/JobFilterUtils';

export const useJobFilters = () => {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const handleFilterChange = useCallback((key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  }, [filters.category]);

  return {
    filters,
    handleFilterChange,
    resetFilters: () => setFilters(defaultFilters)
  };
};