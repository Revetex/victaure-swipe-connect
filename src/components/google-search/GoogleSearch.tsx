
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GoogleSearchProps {
  searchEngineId: string;
}

export function GoogleSearch({ searchEngineId }: GoogleSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    const searchUrl = `https://cse.google.com/cse?cx=${searchEngineId}&q=${encodeURIComponent(searchTerm)}`;
    window.open(searchUrl, '_blank');
    setIsSearching(false);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Rechercher des offres d'emploi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 h-12 bg-background dark:bg-[#1B2A4A]/50 border-border/10 dark:border-[#64B5D9]/10"
      />
      <Button 
        type="submit" 
        disabled={isSearching}
        className="h-12 px-6 bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB]"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </form>
  );
}
