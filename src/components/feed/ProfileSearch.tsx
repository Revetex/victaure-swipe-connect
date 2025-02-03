import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserRound } from "lucide-react";
import { useDebounce } from "use-debounce";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

interface Profile extends UserProfile {
  id: string;
}

export function ProfileSearch({ onSelect, placeholder = "Search...", className = "" }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["profile-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim()) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("full_name", `%${debouncedSearch}%`)
        .limit(5);

      if (error) {
        console.error("Error searching profiles:", error);
        return [];
      }

      return (data || []) as Profile[];
    },
    enabled: debouncedSearch.trim().length > 0,
    initialData: [],
  });

  const handleSelect = (profileId: string) => {
    const selectedProfile = searchResults.find((p) => p.id === profileId);
    if (selectedProfile) {
      onSelect(selectedProfile);
      setSearch("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Command 
        value={search}
        onValueChange={setSearch}
        shouldFilter={false} 
        className="rounded-lg border shadow-md"
      >
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          className="border-none focus:ring-0"
        />
        {search.trim().length > 0 && (
          <CommandGroup className="max-h-[300px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : searchResults.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </CommandEmpty>
            ) : (
              searchResults.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.id}
                  onSelect={handleSelect}
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback>
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{profile.full_name}</span>
                </CommandItem>
              ))
            )}
          </CommandGroup>
        )}
      </Command>
    </div>
  );
}