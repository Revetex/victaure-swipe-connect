
import { SearchIcon, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

interface SearchBarProps {
  searchTerm: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export function SearchBar({
  searchTerm,
  isSearching,
  onSearchChange,
  onSearch
}: SearchBarProps) {
  const { profile } = useProfile();

  const generateRandomSearch = () => {
    if (!profile) {
      toast.error("Veuillez vous connecter pour utiliser cette fonctionnalité");
      return;
    }
    
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
      onSearchChange(query);
      onSearch(new Event('submit') as any);
    } else {
      toast.error("Complétez votre profil pour des recherches personnalisées");
    }
  };

  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Rechercher des offres d'emploi..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
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
        variant="outline"
        title="Générer une recherche basée sur votre profil"
      >
        <Wand2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
