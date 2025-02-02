import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, MessageSquare, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

export function ProfileSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role");

      if (error) throw error;
      return data as Profile[];
    }
  });

  const handleConnect = async (userId: string) => {
    try {
      const { data: existingRequest } = await supabase
        .from("messages")
        .select()
        .eq("sender_id", userId)
        .single();

      if (existingRequest) {
        toast.info("Une demande de connexion existe déjà");
        return;
      }

      const { error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: userId,
            receiver_id: userId,
            content: "Demande de connexion",
          }
        ]);

      if (error) throw error;
      toast.success("Demande de connexion envoyée");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Erreur lors de l'envoi de la demande de connexion");
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  const handleMessage = (userId: string) => {
    navigate(`/dashboard/messages?user=${userId}`);
  };

  return (
    <div>
      <Button 
        variant="outline" 
        className="w-full justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <UserCircle className="mr-2 h-4 w-4" />
        Rechercher un profil...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher un profil..." />
        <CommandList>
          <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
          {isLoadingProfiles ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Chargement des profils...
            </div>
          ) : profiles && profiles.length > 0 ? (
            <CommandGroup heading="Profils">
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center gap-2">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-muted-foreground" />
                    )}
                    <span>{profile.full_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewProfile(profile.id)}
                    >
                      <UserCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMessage(profile.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleConnect(profile.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </div>
  );
}