import { useState } from "react";
import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ProfileSearch() {
  const [search, setSearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      if (!search) return [];
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('full_name', `%${search}%`)
          .limit(5);

        if (error) {
          console.error("Error fetching profiles:", error);
          return [];
        }

        return (data || []) as UserProfile[];
      } catch (error) {
        console.error("Error in query:", error);
        return [];
      }
    },
    enabled: search.length > 0,
    initialData: [],
  });

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleMessage = async (profile: UserProfile) => {
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour envoyer un message");
        return;
      }

      // Create or get existing conversation
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          sender_id: session.user.id,
          receiver_id: profile.id,
          content: "Nouvelle conversation",
          read: false
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating message:", error);
        toast.error("Erreur lors de la création de la conversation");
        return;
      }

      // Navigate to messages page
      navigate(`/dashboard/messages/${message.id}`);
      toast.success("Conversation créée avec succès");
    } catch (error) {
      console.error("Error in handleMessage:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="relative">
      <Command className="relative z-50 max-w-lg mx-auto">
        <Command.Input
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          placeholder="Rechercher un profil..."
          className="w-full px-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isInputFocused && search.length > 0 && (
          <Command.List className="absolute w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
            {profiles.map((profile) => (
              <Command.Item
                key={profile.id}
                value={profile.full_name || ''}
                onSelect={() => handleSelectProfile(profile)}
                className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
              >
                <span>{profile.full_name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(profile);
                  }}
                  className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Message
                </button>
              </Command.Item>
            ))}
          </Command.List>
        )}
      </Command>

      {selectedProfile && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-medium">{selectedProfile.full_name}</h3>
          <p className="text-sm text-muted-foreground">{selectedProfile.role}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleMessage(selectedProfile)}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Envoyer un message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}