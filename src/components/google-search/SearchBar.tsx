
import { SearchIcon, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";

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
  const { isDark } = useThemeContext();
  
  const generateRandomSearch = () => {
    if (!profile) {
      toast.error("Veuillez vous connecter pour utiliser cette fonctionnalité");
      return;
    }
    
    const searchTerms = [...(profile.skills || []), profile.company_name, profile.city].filter(Boolean);
    
    if (searchTerms.length > 0) {
      const selectedTerms = searchTerms.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 2);
      const query = selectedTerms.join(' ') + ' emploi';
      onSearchChange(query);
      onSearch(new Event('submit') as any);
    } else {
      toast.error("Complétez votre profil pour des recherches personnalisées");
    }
  };
  
  return (
    <form onSubmit={onSearch} className="flex gap-2 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          type="text" 
          placeholder="Rechercher des offres d'emploi..." 
          value={searchTerm} 
          onChange={e => onSearchChange(e.target.value)} 
          className={cn(
            "pl-10 pr-4 py-2 h-12 rounded-lg w-full",
            "bg-background/50 border-border/30",
            "focus:ring-1 focus:ring-primary/30 focus:border-primary/50",
            "transition-all duration-200",
            isDark ? "placeholder:text-white/40" : "placeholder:text-slate-400"
          )}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSearching} 
        className={cn(
          "h-12 px-4 bg-primary/80 hover:bg-primary text-white",
          "transition-all duration-200 hover:shadow-md"
        )}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        type="button" 
        onClick={generateRandomSearch} 
        className={cn(
          "h-12 px-4 bg-background/50 border-border/30 text-foreground",
          "hover:bg-background/70 transition-all duration-200",
          "hover:border-primary/30"
        )}
        variant="outline" 
        title="Générer une recherche basée sur votre profil"
      >
        <Wand2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
