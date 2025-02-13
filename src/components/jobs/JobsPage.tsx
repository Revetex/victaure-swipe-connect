import { useState } from "react";
import { motion } from "framer-motion";
import { JobList } from "./JobList";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { FilterSection } from "./filters/FilterSection";
import { useJobFilters } from "@/hooks/useJobFilters";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function JobsPage() {
  const { filters, updateFilter, resetFilters } = useJobFilters();
  const [showFilters, setShowFilters] = useState(true);

  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className={cn(
          "lg:w-80 shrink-0",
          showFilters ? "block" : "hidden lg:block"
        )}>
          <div className="sticky top-32">
            <JobFiltersPanel
              filters={filters}
              onFilterChange={updateFilter}
            />
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </Button>

            <Link to="/jobs/new">
              <Button className="ml-auto" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Créer une mission
              </Button>
            </Link>
          </div>

          <FilterSection 
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
          />

          <JobList 
            filters={filters}
            showFilters={showFilters}
          />
        </main>
      </div>
    </PageLayout>
  );
}
