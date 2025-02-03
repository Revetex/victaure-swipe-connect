import { useState, useCallback } from "react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Avatar } from "@/components/ui/avatar";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface ProfileSearchProps {
  onSelect: (profile: Profile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Rechercher...", className = "" }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: searchResults = [], isLoading, error } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch?.trim()) return [];

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .ilike("full_name", `%${debouncedSearch}%`)
          .limit(5);

        if (error) {
          console.error("Error fetching profiles:", error);
          toast.error("Erreur lors de la recherche");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in search query:", error);
        toast.error("Erreur lors de la recherche");
        return [];
      }
    },
    enabled: debouncedSearch.length > 0,
  });

  const handleSelect = useCallback((profile: Profile) => {
    console.log("Selected profile:", profile);
    onSelect(profile);
    setSearch(""); // Reset search after selection
  }, [onSelect]);

  return (
    <div className={`relative ${className}`}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          className="h-9"
        />
        {search.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50">
            <div className="rounded-lg border bg-popover text-popover-foreground shadow-lg">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : searchResults.length === 0 ? (
                <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
                  Aucun résultat trouvé.
                </CommandEmpty>
              ) : (
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {searchResults.map((profile) => (
                    <CommandItem
                      key={profile.id}
                      value={profile.id}
                      onSelect={() => handleSelect(profile)}
                      className="cursor-pointer hover:bg-accent p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {profile.avatar_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </Avatar>
                        <span className="text-sm">{profile.full_name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </div>
          </div>
        )}
      </Command>
    </div>
  );
}