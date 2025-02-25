
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function GoogleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    const encodedQuery = encodeURIComponent(searchTerm);
    // Utilisation du moteur de recherche personnalisé Google pour les offres d'emploi au Québec
    const newSearchUrl = `https://cse.google.com/cse/publicurl?cx=1262c5460a0314a80&q=${encodedQuery}`;
    setSearchUrl(newSearchUrl);
  };

  return (
    <div className="space-y-4">
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
      
      {searchUrl && (
        <div className="mt-4 border border-border/10 dark:border-[#64B5D9]/10 rounded-lg overflow-hidden">
          <iframe
            src={searchUrl}
            className="w-full h-[800px] bg-white dark:bg-[#1B2A4A]"
            style={{
              border: "none",
              display: "block",
              width: "100%",
            }}
            frameBorder="0"
            scrolling="yes"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
