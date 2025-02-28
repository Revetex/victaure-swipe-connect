
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { transformToFullProfile } from "@/utils/profileTransformers";
import { SearchResults } from "./SearchResults";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2 } from "lucide-react";

interface ProfileSearchProps {
  onSelect?: (profile: UserProfile) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Rechercher des profils...", className }: ProfileSearchProps) {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .limit(5);

      if (error) throw error;

      const transformedResults = (data || []).map(profile => 
        transformToFullProfile({
          ...profile,
          certifications: [],
          education: [],
          experiences: []
        })
      );
      
      setSearchResults(transformedResults);
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className={className}>
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {searchResults.length > 0 && searchQuery && (
          <div className="absolute w-full z-[100] mt-1">
            <SearchResults 
              results={searchResults}
              onSelect={(profile) => {
                if (onSelect) {
                  onSelect(profile);
                  setSearchQuery("");
                  setSearchResults([]);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
