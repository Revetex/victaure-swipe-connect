
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
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=22e4528bd7c6f4db0";
    script.async = true;
    document.head.appendChild(script);

    return () => {
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
    const searchTerms = [
      ...profile.skills || [],
      profile.company_name,
      profile.city,
    ].filter(Boolean);

    if (searchTerms.length > 0) {
      const selectedTerms = searchTerms
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 2);
      
      const query = selectedTerms.join(' ') + ' emploi';
      setSearchTerm(query);
      triggerSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full max-w-5xl mx-auto">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Rechercher des offres d'emploi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 bg-background/50"
        />
        <Button 
          type="submit" 
          disabled={isSearching}
          className="h-12 px-4"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={generateRandomSearch}
          className="h-12 px-4"
          title="Générer une recherche basée sur votre profil"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-background/50 rounded-lg p-4">
        <div className="gcse-searchresults-only"></div>
      </div>
    </form>
  );
}
