import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Avatar } from "@/components/ui/avatar";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

interface ProfileSearchProps {
  onSelect: (profile: Profile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ 
  onSelect, 
  placeholder = "Rechercher un utilisateur...", 
  className 
}: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch?.trim()) return [];
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .or(`full_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`)
          .limit(5);

        if (error) {
          console.error("Error fetching profiles:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in search query:", error);
        return [];
      }
    },
    enabled: Boolean(debouncedSearch?.trim()),
  });

  const handleSelect = useCallback((profile: Profile) => {
    onSelect(profile);
    setSearch(""); // Reset search after selection
  }, [onSelect]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <Command className={`relative ${className}`}>
      <CommandInput
        placeholder={placeholder}
        value={search}
        onValueChange={handleSearchChange}
        className="w-full"
      />
      {(search || isLoading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <CommandList className="bg-popover border rounded-md shadow-md max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <CommandEmpty className="py-6 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <span className="text-sm text-muted-foreground mt-2">
                  Recherche en cours...
                </span>
              </CommandEmpty>
            ) : searchResults.length === 0 ? (
              <CommandEmpty className="py-6">
                Aucun résultat trouvé.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {searchResults.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={profile.id}
                    onSelect={() => handleSelect(profile)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img 
                          src={profile.avatar_url || "/user-icon.svg"} 
                          alt={profile.full_name || ""}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/user-icon.svg";
                          }}
                        />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {profile.full_name || "Sans nom"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {profile.email}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      )}
    </Command>
  );
}