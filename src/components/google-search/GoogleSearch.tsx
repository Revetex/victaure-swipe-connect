
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function GoogleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Ajouter le script Google Custom Search
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=22e4528bd7c6f4db0";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Nettoyer le script lors du démontage du composant
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    // Déclencher une nouvelle recherche
    const element = document.querySelector('.gsc-search-box input') as HTMLInputElement;
    if (element) {
      element.value = searchTerm;
      const searchButton = document.querySelector('.gsc-search-button button') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }
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
      
      <div className="mt-4 border border-border/10 dark:border-[#64B5D9]/10 rounded-lg overflow-hidden bg-white dark:bg-[#1B2A4A] p-4">
        <div className="gcse-searchresults-only"></div>
      </div>
    </div>
  );
}
