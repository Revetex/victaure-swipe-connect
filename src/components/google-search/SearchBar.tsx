
import { SearchIcon, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

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
  const { isDark, themeStyle } = useThemeContext();
  
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
    <motion.form 
      onSubmit={onSearch} 
      className="flex gap-2 w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
        <Input 
          type="text" 
          placeholder="Rechercher des offres d'emploi..." 
          value={searchTerm} 
          onChange={e => onSearchChange(e.target.value)} 
          className={cn(
            "pl-10 pr-4 py-2 h-12 rounded-lg w-full",
            "backdrop-blur-sm border border-white/10",
            "focus:ring-1 focus:ring-primary/30 focus:border-primary/50",
            "transition-all duration-200",
            isDark ? "bg-black/20 placeholder:text-white/40" : "bg-white/10 placeholder:text-slate-400",
            `theme-${themeStyle}`
          )}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSearching} 
        className={cn(
          "h-12 px-4 bg-primary/80 hover:bg-primary text-white",
          "transition-all duration-200 hover:shadow-md",
          "backdrop-blur-sm"
        )}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        type="button" 
        onClick={generateRandomSearch} 
        className={cn(
          "h-12 px-4 backdrop-blur-sm border border-white/10 text-foreground",
          "hover:bg-white/10 transition-all duration-200",
          "hover:border-primary/30",
          isDark ? "bg-black/20" : "bg-white/5"
        )}
        variant="outline" 
        title="Générer une recherche basée sur votre profil"
      >
        <Wand2 className="h-4 w-4" />
      </Button>
    </motion.form>
  );
}
