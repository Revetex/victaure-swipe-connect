
import { useState } from "react";
import { JobList } from "./JobList";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { FilterSection } from "./filters/FilterSection";
import { useJobFilters } from "@/hooks/useJobFilters";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, List, Grid3X3, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobStats } from "./sections/JobStats";
import { JobHeader } from "./sections/JobHeader";

export function JobsPage() {
  const { filters, updateFilter, resetFilters } = useJobFilters();
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'cards'>('grid');

  // Exemple de données pour JobStats - à remplacer par des données réelles
  const statsData = {
    totalJobs: 1234,
    newToday: 56,
    topLocation: "Montréal",
    topCompany: "Victaure Inc."
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobHeader onSearch={(value) => updateFilter("searchTerm", value)} totalJobs={statsData.totalJobs} />
        
        <JobStats {...statsData} />

        <Tabs defaultValue="regular" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="regular">Emplois réguliers</TabsTrigger>
              <TabsTrigger value="contract">Contrats & Jobines</TabsTrigger>
              <TabsTrigger value="marketplace">Victaure Market</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select 
                value={viewMode} 
                onValueChange={(value: 'list' | 'grid' | 'cards') => setViewMode(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">
                    <span className="flex items-center">
                      <List className="h-4 w-4 mr-2" />
                      Liste
                    </span>
                  </SelectItem>
                  <SelectItem value="grid">
                    <span className="flex items-center">
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Grille
                    </span>
                  </SelectItem>
                  <SelectItem value="cards">
                    <span className="flex items-center">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Cartes
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Link to="/jobs/new">
                <Button className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  Publier une offre
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className={cn(
              "lg:w-80 shrink-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]",
              showFilters ? "block" : "hidden lg:block"
            )}>
              <JobFiltersPanel 
                filters={filters} 
                onFilterChange={updateFilter}
                onReset={resetFilters}
              />
            </aside>

            <main className="flex-1 space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Button 
                  variant="outline" 
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
                </Button>
              </div>

              <FilterSection 
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
              />

              <TabsContent value="regular">
                <JobList 
                  filters={filters}
                  filterType="regular"
                  showFilters={showFilters}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="contract">
                <JobList 
                  filters={filters}
                  filterType="contract"
                  showFilters={showFilters}
                  viewMode={viewMode}
                />
              </TabsContent>

              <TabsContent value="marketplace">
                <JobList 
                  filters={filters}
                  filterType="marketplace"
                  showFilters={showFilters}
                  viewMode={viewMode}
                />
              </TabsContent>
            </main>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
}
