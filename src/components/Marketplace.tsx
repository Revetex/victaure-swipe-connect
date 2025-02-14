
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { ExternalSearchSection } from "./jobs/sections/ExternalSearchSection";
import { JobFilters } from "./jobs/JobFilterUtils";
import { defaultFilters } from "./jobs/JobFilterUtils";

export function Marketplace() {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8">
        <ExternalSearchSection 
          queryString={filters.searchTerm || ""}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </section>
    </div>
  );
}
