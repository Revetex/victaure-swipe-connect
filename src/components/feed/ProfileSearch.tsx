import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { Users } from "lucide-react";

interface ProfileSearchProps {
  onClose?: () => void;
}

export function ProfileSearch({ onClose }: ProfileSearchProps) {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      // Get the current user's ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch friends from friend_requests table where status is 'accepted'
      const { data: friends, error: friendError } = await supabase
        .from('friend_requests')
        .select(`
          sender:sender_id(id, full_name, email, avatar_url),
          receiver:receiver_id(id, full_name, email, avatar_url)
        `)
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .eq('status', 'accepted');

      if (friendError) throw friendError;

      // Transform friends data into a flat array of profiles
      const friendProfiles = friends?.flatMap(friend => {
        const profiles = [];
        if (friend.sender && friend.sender.id !== session.user.id) {
          profiles.push(friend.sender);
        }
        if (friend.receiver && friend.receiver.id !== session.user.id) {
          profiles.push(friend.receiver);
        }
        return profiles;
      }) || [];

      // Filter friends based on search value
      const filteredFriends = friendProfiles.filter(friend => 
        friend.full_name?.toLowerCase().includes(value.toLowerCase()) ||
        friend.email.toLowerCase().includes(value.toLowerCase())
      );

      setSearchResults(filteredFriends);
    } catch (error) {
      console.error('Error searching friends:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Nouvelle conversation</h2>
      </div>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Rechercher un ami..." 
          onValueChange={handleSearch}
          className="h-12"
        />
        <CommandList>
          {hasSearched && searchResults.length === 0 && (
            <CommandEmpty>Aucun ami trouvé.</CommandEmpty>
          )}
          <CommandGroup>
            {searchResults.map((profile) => (
              <CommandItem
                key={profile.id}
                value={profile.full_name || profile.email}
                onSelect={() => handleSelectProfile(profile)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium">{profile.full_name || 'Sans nom'}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      {selectedProfile && (
        <ProfilePreview 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}