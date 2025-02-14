
import { useState } from "react";
import { JobList } from "./JobList";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { FilterSection } from "./filters/FilterSection";
import { useJobFilters } from "@/hooks/useJobFilters";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function JobsPage() {
  const { filters, updateFilter, resetFilters } = useJobFilters();
  const [showFilters, setShowFilters] = useState(true);

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="regular" className="w-full">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="regular">Emplois réguliers</TabsTrigger>
              <TabsTrigger value="contract">Contrats & Jobines</TabsTrigger>
              <TabsTrigger value="marketplace">Victaure Market</TabsTrigger>
            </TabsList>

            <Link to="/jobs/new" className="ml-auto">
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Publier une offre
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className={cn(
              "lg:w-80 shrink-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]",
              showFilters ? "block" : "hidden lg:block"
            )}>
              <JobFiltersPanel 
                filters={filters} 
                onFilterChange={updateFilter}
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
                  filters={{ ...filters, source: "regular" }}
                  showFilters={showFilters}
                />
              </TabsContent>

              <TabsContent value="contract">
                <JobList 
                  filters={{ ...filters, source: "contract" }}
                  showFilters={showFilters}
                />
              </TabsContent>

              <TabsContent value="marketplace">
                <JobList 
                  filters={{ ...filters, source: "marketplace" }}
                  showFilters={showFilters}
                />
              </TabsContent>
            </main>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
}
