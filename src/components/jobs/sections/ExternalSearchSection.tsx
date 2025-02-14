
import { JobFilters } from "../JobFilterUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CreditCard } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobList } from "../JobList";
import { useJobsData } from "@/hooks/useJobsData";

interface ExternalSearchSectionProps {
  queryString: string;
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExternalSearchSection({ 
  queryString,
  filters,
  onFilterChange 
}: ExternalSearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState(queryString);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { data: jobs, isLoading } = useJobsData(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange("searchTerm", searchTerm);
  };

  return (
    <div className="w-full p-4 bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recherche d'emplois</h3>
        <Button
          variant="outline"
          onClick={() => setShowPaymentDialog(true)}
          className="gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Paramètres de paiement
        </Button>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Rechercher un emploi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </form>

      <ScrollArea className="h-[calc(100vh-20rem)]">
        <JobList 
          filters={filters}
          showFilters={false}
          jobs={jobs}
        />
      </ScrollArea>
    </div>
  );
}
