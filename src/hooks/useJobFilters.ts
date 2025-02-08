
import { useState } from "react";
import { JobFilters } from "@/components/jobs/JobFilterUtils";

export function useJobFilters() {
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    subcategory: "all",
    duration: "all",
    experienceLevel: "all",
    location: "",
    province: "all",
    remoteType: "all",
    minBudget: 300,
    maxBudget: 1000,
    skills: [],
    searchTerm: "",
    createdAfter: null,
    createdBefore: null,
    deadlineBefore: null,
  });

  const updateFilter = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      subcategory: "all",
      duration: "all",
      experienceLevel: "all",
      location: "",
      province: "all",
      remoteType: "all",
      minBudget: 300,
      maxBudget: 1000,
      skills: [],
      searchTerm: "",
      createdAfter: null,
      createdBefore: null,
      deadlineBefore: null,
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters
  };
}
