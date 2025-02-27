
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface MarketplaceSearchProps {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
}

export function MarketplaceSearch({ value, onChange, isSearching = false }: MarketplaceSearchProps) {
  const isMobile = useIsMobile();
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 500);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  // Effectuer la recherche sur le debounce
  const triggerSearchWithSuggestions = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Appeler la fonction de recherche Supabase
      const { data, error } = await supabase.rpc('search_marketplace_listings', { 
        query,
        p_limit: 20
      });

      if (error) throw error;

      // Mettre à jour l'état de recherche
      onChange(query);
      
      // Afficher le nombre de résultats trouvés
      if (data && data.length > 0) {
        toast.success(`${data.length} résultat(s) trouvé(s)`);
      } else {
        toast.info("Aucun résultat trouvé. Essayez d'autres mots-clés.");
      }
      
    } catch (error) {
      console.error('Erreur de recherche:', error);
      onChange(query); // Mettre quand même à jour la recherche
    }
  };

  // Effet pour déclencher la recherche lorsque la valeur debounced change
  React.useEffect(() => {
    if (debouncedValue !== value) {
      triggerSearchWithSuggestions(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Input
          type="search"
          placeholder="Rechercher dans le marketplace..."
          value={inputValue}
          onChange={handleChange}
          className={`pl-10 ${isMobile ? 'h-10' : 'h-11'} dark:bg-zinc-800/90 border-zinc-300 dark:border-zinc-700`}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500"
          onClick={() => {
            setInputValue('');
            onChange('');
          }}
        >
          Effacer
        </Button>
      )}
    </div>
  );
}
