
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder, className }: ProfileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", (await supabase.auth.getUser()).data.user?.id || "");

      if (error) throw error;
      return data as UserProfile[];
    }
  });

  const filteredProfiles = useMemo(() => {
    if (!profiles || !searchQuery.trim()) return [];
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return profiles.filter(
      (profile) => profile.full_name?.toLowerCase().includes(normalizedQuery)
    );
  }, [profiles, searchQuery]);

  return (
    <Command className={cn("rounded-lg border shadow-sm", className)}>
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder={placeholder || "Rechercher un utilisateur..."}
        className="h-11"
      />
      {searchQuery.trim() && (
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup>
            {filteredProfiles.map((profile) => (
              <CommandItem
                key={profile.id}
                value={profile.full_name || ""}
                onSelect={() => {
                  onSelect(profile);
                  setSearchQuery("");
                }}
                className="flex items-center gap-3 p-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {profile.full_name || "Utilisateur"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
