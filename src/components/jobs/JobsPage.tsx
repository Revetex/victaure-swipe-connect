
import { useState } from "react";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Rechercher un emploi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline">Filtres</Button>
        </div>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Aucun emploi trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche
          </p>
        </Card>
      ) : (
        <JobList 
          jobs={filteredJobs} 
          onJobSelect={handleJobSelect}
          selectedJobId={selectedJobId}
        />
      )}
    </div>
  );
}
