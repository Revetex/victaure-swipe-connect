
import { useState } from "react";
import type { JobFilters } from "@/types/filters";
import { defaultFilters } from "@/components/jobs/JobFilterUtils";

export function useJobFilters() {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const updateFilter = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    updateFilter,
    resetFilters
  };
}

