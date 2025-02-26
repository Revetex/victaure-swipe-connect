
import { SearchIcon, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import "./GoogleSearchStyles.css";

export function GoogleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { profile } = useProfile();

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
    triggerSearch(searchTerm);
  };

  const triggerSearch = (query: string) => {
    const element = document.querySelector('.gsc-search-box input') as HTMLInputElement;
    if (element) {
      element.value = query;
      const searchButton = document.querySelector('.gsc-search-button button') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }
  };

  const generateRandomSearch = () => {
    if (!profile) return;

    // Créer une recherche basée sur le profil
    const searchTerms = [
      ...profile.skills || [],
      profile.company_name,
      profile.city,
    ].filter(Boolean);

    if (searchTerms.length > 0) {
      // Sélectionner 2-3 termes aléatoires
      const selectedTerms = searchTerms
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 2);
      
      const query = selectedTerms.join(' ') + ' emploi';
      setSearchTerm(query);
      triggerSearch(query);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-2 w-full">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher des offres d'emploi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-14 bg-background/50 dark:bg-[#1B2A4A]/30 border-border/10 dark:border-[#64B5D9]/10"
          />
          <Button 
            type="submit" 
            disabled={isSearching}
            className="h-14 px-6 text-primary-foreground bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB] dark:text-white"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </form>
        <Button
          type="button"
          onClick={generateRandomSearch}
          className="h-14 px-6 text-primary-foreground bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB] dark:text-white"
          title="Générer une recherche basée sur votre profil"
        >
          <Wand2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mt-4 bg-background/50 dark:bg-[#1B2A4A]/30 backdrop-blur-sm border border-border/10 dark:border-[#64B5D9]/10 rounded-lg p-6 shadow-lg w-full">
        <div className="gcse-searchresults-only w-full"></div>
      </div>
    </div>
  );
}
