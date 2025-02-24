
import { useState } from "react";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useJobsData } from "@/hooks/useJobsData";

export function ExternalSearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: jobs = [], isLoading } = useJobsData();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredJobs([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(' ');
    const results = jobs.filter(job => {
      const searchContent = `${job.title} ${job.company} ${job.description} ${job.location}`.toLowerCase();
      return searchTerms.every(term => searchContent.includes(term));
    });

    setFilteredJobs(results);

    if (results.length === 0) {
      toast.info("Aucun résultat trouvé");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Recherche d'emplois</h3>
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un emploi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Rechercher"}
          </Button>
        </div>

        {filteredJobs.length > 0 && (
          <div className="mt-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="border-b last:border-0 py-4">
                <h4 className="font-semibold">{job.title}</h4>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <p className="text-sm">{job.location}</p>
                {job.url && (
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Voir l'offre
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
