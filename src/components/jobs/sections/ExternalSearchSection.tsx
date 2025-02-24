
import { useState } from "react";
import { JobList } from "../JobList";
import { Job } from "@/types/job";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

export function ExternalSearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Veuillez entrer un terme de recherche");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-external-jobs?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      
      const data = await response.json();
      setJobs(data.jobs);
      
      if (data.jobs.length === 0) {
        toast.info("Aucun résultat trouvé");
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast.error("Impossible de récupérer les emplois");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Recherche externe</h3>
      
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
          disabled={isSearching}
        >
          {isSearching ? "Recherche..." : "Rechercher"}
        </Button>
      </div>

      {jobs.length > 0 && (
        <JobList jobs={jobs} onJobSelect={() => {}} />
      )}
    </div>
  );
}
