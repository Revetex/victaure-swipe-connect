import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Avatar } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

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

export function ProfileSearch({ onSelect, placeholder = "Rechercher un utilisateur...", className }: ProfileSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const { data: searchResults = [] } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .or(`full_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`)
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: Boolean(debouncedSearch),
  });

  const handleSelect = useCallback((profile: Profile) => {
    setSelectedProfile(profile);
    onSelect(profile);
    setOpen(false);
  }, [onSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className={`justify-start text-left font-normal ${className}`}
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {selectedProfile ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <img src={selectedProfile.avatar_url || "/user-icon.svg"} alt={selectedProfile.full_name || ""} />
              </Avatar>
              <span>{selectedProfile.full_name || selectedProfile.email}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
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
                      <img src={profile.avatar_url || "/user-icon.svg"} alt={profile.full_name || ""} />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{profile.full_name || "Sans nom"}</span>
                      <span className="text-sm text-muted-foreground">{profile.email}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}