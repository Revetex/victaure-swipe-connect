
import { useState } from "react";
import { motion } from "framer-motion";
import { JobList } from "./JobList";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { FilterSection } from "./filters/FilterSection";
import { useJobFilters } from "@/hooks/useJobFilters";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function JobsPage() {
  const { filters, updateFilter, resetFilters } = useJobFilters();
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("searchTerm", searchTerm);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trouvez votre prochain emploi
          </h1>
          <p className="text-muted-foreground">
            Parcourez les offres d'emploi disponibles ou publiez votre propre annonce
          </p>
        </div>

        {/* Barre de recherche principale */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto w-full">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher un poste, une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3"
            />
            <Button 
              type="submit" 
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* Panneau de filtres */}
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
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Button 
                variant="outline" 
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </Button>

              <Link to="/jobs/new" className="ml-auto">
                <Button className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  Publier une offre
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
      </div>
    </PageLayout>
  );
}
