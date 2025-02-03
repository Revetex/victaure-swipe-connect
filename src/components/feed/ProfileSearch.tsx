import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

interface ProfileSearchProps {
  onSelect: (profile: any) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Search...", className }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      const query = supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (debouncedSearch) {
        query.ilike("full_name", `%${debouncedSearch}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }

      return data || [];
    },
    enabled: true,
  });

  return (
    <div className={`relative ${className}`}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
        />
        {(isLoading || profiles.length > 0 || debouncedSearch) && (
          <CommandList className="mt-1 max-h-[300px] overflow-y-auto">
            <CommandGroup>
              {isLoading && (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </CommandItem>
              )}
              
              {!isLoading && profiles.length === 0 && debouncedSearch && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  onSelect={() => onSelect(profile)}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`cursor-pointer ${
                    hoveredId === profile.id ? "bg-accent" : ""
                  }`}
                >
                  {profile.full_name || profile.email}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}