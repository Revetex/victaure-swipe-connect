
import { Search, Plus } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePreview } from "@/components/ProfilePreview";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectFriend: (friendId: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange, onSelectFriend }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const { data: profiles } = useQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: searchQuery.length > 0
  });

  return (
    <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <Command shouldFilter={false} className="flex-1">
          <CommandInput 
            placeholder="Rechercher une conversation..." 
            value={searchQuery}
            onValueChange={(value) => {
              onSearchChange(value);
              setOpen(true);
            }}
          />
          {open && (
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup heading="Résultats">
                {profiles?.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={profile.full_name || ""}
                    onSelect={() => {
                      setSelectedProfile(profile);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile.avatar_url || ""} />
                      <AvatarFallback>
                        {profile.full_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{profile.full_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
        <FriendSelector onSelectFriend={onSelectFriend}>
          <Button variant="outline" size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </FriendSelector>
      </div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}
