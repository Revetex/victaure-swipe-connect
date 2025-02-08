
import { JobFilters } from "../JobFilterUtils";
import { JobFiltersPanel } from "../JobFiltersPanel";
import { ScrapedJobsList } from "../ScrapedJobsList";
import { motion } from "framer-motion";
import { JobFilters as JobFiltersComponent } from "../JobFilters";
import { useEffect, useState } from "react";

interface ExternalSearchSectionProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExternalSearchSection({ 
  filters,
  onFilterChange 
}: ExternalSearchSectionProps) {
  const [queryString, setQueryString] = useState<string>("");

  // Effet pour construire la requête de recherche basée sur les filtres
  useEffect(() => {
    const parts = [];

    if (filters.searchTerm) {
      parts.push(filters.searchTerm);
    }

    if (filters.category && filters.category !== "all") {
      parts.push(filters.category);
    }

    if (filters.location) {
      parts.push(`${filters.location}`);
    }

    if (filters.experienceLevel && filters.experienceLevel !== "all") {
      parts.push(filters.experienceLevel);
    }

    if (filters.remoteType && filters.remoteType !== "all") {
      parts.push(filters.remoteType === "remote" ? "télétravail" : filters.remoteType);
    }

    setQueryString(parts.join(" "));

  }, [filters]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-80 shrink-0">
          <JobFiltersPanel 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </aside>

        <main className="flex-1">
          <ScrapedJobsList 
            queryString={queryString}
          />
        </main>
      </div>
    </motion.div>
  );
}
