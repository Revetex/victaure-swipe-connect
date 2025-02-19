
import { useState } from "react";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Filter } from "lucide-react";

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: jobs = [], isLoading } = useJobsData();
  const [selectedJobId, setSelectedJobId] = useState<string>();

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-start gap-3">
            <Briefcase className="h-8 w-8 text-primary shrink-0" />
            <h1 className="text-3xl font-bold tracking-tight truncate">Offres d'emploi</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Trouvez votre prochain emploi parmi nos offres sélectionnées
          </p>
        </div>

        {/* Search Section */}
        <Card className="p-6 shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Rechercher par titre, entreprise ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-background/50 border-primary/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button variant="outline" size="lg" className="gap-2 h-12 border-primary/20 hover:border-primary">
              <Filter className="h-5 w-5" />
              Filtres avancés
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <div className="min-h-[60vh]">
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm">
              <div className="max-w-md mx-auto space-y-4">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-2xl font-semibold">Aucun emploi trouvé</h3>
                <p className="text-muted-foreground text-lg">
                  Essayez de modifier vos critères de recherche ou revenez plus tard pour voir de nouvelles offres
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="mt-4"
                >
                  Réinitialiser la recherche
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
                </p>
                <Button variant="ghost" className="text-primary">
                  Trier par date
                </Button>
              </div>
              <JobList 
                jobs={filteredJobs} 
                onJobSelect={handleJobSelect}
                selectedJobId={selectedJobId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
