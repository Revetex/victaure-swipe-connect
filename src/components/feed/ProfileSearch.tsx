import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { SearchResults } from "./friends/SearchResults";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Search...", className }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

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

      return data as UserProfile[];
    },
    enabled: Boolean(debouncedSearch),
  });

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
    onSelect(profile);
  };

  const handleProfilePreviewClose = () => {
    setSelectedProfile(null);
    setSearch("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Command className="rounded-lg border shadow-md bg-background">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList>
          <SearchResults
            isLoading={isLoading}
            profiles={profiles}
            debouncedSearch={debouncedSearch}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onSelect={handleProfileClick}
          />
        </CommandList>
      </Command>

      {selectedProfile && (
        <ProfilePreview 
          profile={selectedProfile} 
          onClose={handleProfilePreviewClose}
          isOpen={!!selectedProfile}
        />
      )}
    </div>
  );
}