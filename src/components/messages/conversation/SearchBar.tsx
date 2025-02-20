
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { transformSearchResults } from "@/utils/profileTransformers";

export function SearchBar() {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .limit(5);

      if (error) throw error;
      
      setSearchResults(transformSearchResults(data || []));
    } catch (error) {
      console.error('Error searching profiles:', error);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder="Rechercher..."
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
