import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";

export function ProfileSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    
    if (value.length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${value}%`)
        .limit(5);

      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Rechercher un profil..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
          }}
          className="h-9"
        />
        
        {(isInputFocused || searchQuery) && (
          <CommandList className="absolute w-full bg-white dark:bg-gray-950 rounded-b-lg border border-t-0 shadow-lg max-h-[300px] overflow-y-auto z-50">
            {searchQuery.length === 0 ? null : (
              <>
                <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
                <CommandGroup>
                  {searchResults.map((profile) => (
                    <CommandItem
                      key={profile.id}
                      onSelect={() => {
                        navigate(`/dashboard/profile/${profile.id}`);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={profile.avatar_url || ""}
                          alt={profile.full_name || ""}
                        />
                        <AvatarFallback>
                          <UserRound className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {profile.full_name || "Utilisateur"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {profile.role || "Rôle non défini"}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}