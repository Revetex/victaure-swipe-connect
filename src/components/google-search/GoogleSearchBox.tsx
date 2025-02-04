import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function GoogleSearchBox() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
    }
  }, [searchTerm]);

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Rechercher sur Google..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4"
        />
      </div>
    </form>
  );
}