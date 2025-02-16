
"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { UserAvatar } from "@/components/UserAvatar";
import { useNavigate } from "react-router-dom";

export function ProfileSearch() {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', profile?.id)
        .ilike('full_name', `%${value}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Rechercher un profil..." 
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Profils">
            {searchResults.map((result: any) => (
              <CommandItem
                key={result.id}
                onSelect={() => {
                  navigate(`/profile/${result.id}`);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserAvatar
                  user={{
                    avatar_url: result.avatar_url,
                    full_name: result.full_name,
                  }}
                  className="h-8 w-8"
                />
                <span>{result.full_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher un profil..." onValueChange={handleSearch} />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Profils">
            {searchResults.map((result: any) => (
              <CommandItem
                key={result.id}
                onSelect={() => {
                  navigate(`/profile/${result.id}`);
                  setOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserAvatar
                  user={{
                    avatar_url: result.avatar_url,
                    full_name: result.full_name,
                  }}
                  className="h-8 w-8"
                />
                <span>{result.full_name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
