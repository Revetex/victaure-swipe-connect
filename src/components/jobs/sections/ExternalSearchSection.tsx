
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { JobFilters } from "../JobFilterUtils";

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
  const [search, setSearch] = useState(queryString || "");

  const handleSearch = () => {
    const url = `https://www.google.com/search?q=${search}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Rechercher des offres externes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        Rechercher
      </Button>
    </div>
  );
}
