import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProfileSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const searchProfiles = async (term: string) => {
    if (!term.trim()) {
      setProfiles([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${term}%,role.ilike.%${term}%`)
        .limit(10);

      if (error) {
        console.error('Error searching profiles:', error);
        return;
      }

      // Filtrer les informations en fonction des paramètres de confidentialité
      const filteredProfiles = data?.map(profile => ({
        ...profile,
        email: profile.privacy_enabled && profile.id !== user?.id ? null : profile.email,
        phone: profile.privacy_enabled && profile.id !== user?.id ? null : profile.phone,
      })) || [];

      setProfiles(filteredProfiles);
    } catch (error) {
      console.error('Error:', error);
      setProfiles([]);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    searchProfiles(value);
  };

  const handleProfileSelect = (profileId: string) => {
    navigate(`/dashboard/profile/${profileId}`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Logo size="sm" />
        <span className="text-xl font-bold text-primary">Victaure</span>
      </div>

      <div className="p-4">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Rechercher un profil..."
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {searchTerm.trim() ? (
              profiles.length === 0 ? (
                <CommandEmpty>Aucun profil trouvé</CommandEmpty>
              ) : (
                <CommandGroup heading="Profils">
                  {profiles.map((profile) => (
                    <CommandItem
                      key={profile.id}
                      value={profile.id}
                      onSelect={() => handleProfileSelect(profile.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
                          <AvatarFallback>
                            <UserCircle2 className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{profile.full_name || 'Utilisateur'}</p>
                          <p className="text-xs text-muted-foreground">{profile.role || 'Rôle non défini'}</p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            ) : null}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}