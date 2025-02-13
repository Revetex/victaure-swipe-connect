
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
        .select("*")
        .neq("id", (await supabase.auth.getUser()).data.user?.id || "");

      if (error) throw error;
      return data as UserProfile[];
    }
  });

  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (!searchQuery) return profiles;

    const normalizedQuery = searchQuery.toLowerCase();
    return profiles.filter(
      (profile) =>
        profile.full_name?.toLowerCase().includes(normalizedQuery) ||
        profile.email?.toLowerCase().includes(normalizedQuery)
    );
  }, [profiles, searchQuery]);

  return (
    <Command className={cn("rounded-lg border", className)}>
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder={placeholder || "Rechercher un utilisateur..."}
        className="h-9"
      />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup>
          {filteredProfiles.map((profile) => (
            <CommandItem
              key={profile.id}
              value={profile.full_name || profile.email || ""}
              onSelect={() => onSelect(profile)}
              className="flex items-center gap-2 p-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback>
                  <UserRound className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">
                  {profile.full_name || "Utilisateur"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile.email}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
