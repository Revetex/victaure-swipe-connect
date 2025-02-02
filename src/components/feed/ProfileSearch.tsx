import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";

export function ProfileSearch() {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${value}%,email.ilike.%${value}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(profiles || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Rechercher un profil..." 
          onValueChange={handleSearch}
          className="h-12"
        />
        <CommandList>
          {hasSearched && searchResults.length === 0 && (
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          )}
          <CommandGroup>
            {searchResults.map((profile) => (
              <CommandItem
                key={profile.id}
                value={profile.id} // Changed to use ID as the unique value
                onSelect={() => setSelectedProfile(profile)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium">{profile.full_name || 'Sans nom'}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      {selectedProfile && (
        <ProfilePreview 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}