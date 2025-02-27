
import { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { SearchResults } from "./SearchResults";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2 } from "lucide-react";

interface ProfileSearchProps {
  onSelect?: (profile: UserProfile) => Promise<void>;
  placeholder?: string;
  className?: string;
  searchBy?: 'name' | 'skills' | 'location';
}

export function ProfileSearch({ 
  onSelect, 
  placeholder = "Rechercher des profils...", 
  className = "",
  searchBy = 'name'
}: ProfileSearchProps) {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('*');

      // Adapter la requête en fonction du type de recherche
      switch (searchBy) {
        case 'name':
          queryBuilder = queryBuilder.ilike('full_name', `%${query}%`);
          break;
        case 'skills':
          // Recherche dans l'array des compétences (nécessite une configuration spécifique dans Supabase)
          queryBuilder = queryBuilder.contains('skills', [query]);
          break;
        case 'location':
          // Recherche par ville ou pays
          queryBuilder = queryBuilder.or(`city.ilike.%${query}%,country.ilike.%${query}%`);
          break;
      }
      
      const { data, error } = await queryBuilder.limit(8);

      if (error) throw error;

      // Transformer les résultats en objets UserProfile
      const transformedResults: UserProfile[] = (data || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: (profile.role || 'professional') as any,
        bio: profile.bio,
        phone: profile.phone,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        skills: profile.skills || [],
        online_status: profile.online_status || false,
        last_seen: profile.last_seen,
        created_at: profile.created_at || new Date().toISOString(),
        friends: [],
        certifications: [],
        education: [],
        experiences: []
      }));
      
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

  // Pour gérer le clic en dehors des résultats
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative">
        <Input
          ref={inputRef}
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
          <div ref={resultsRef} className="absolute w-full z-[100] mt-1">
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
