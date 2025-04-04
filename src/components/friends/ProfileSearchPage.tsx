
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ProfileSearchPage() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleProfileSelect = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if a friend request already exists - using maybeSingle() instead of single()
    const { data: existingRequest } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
      .maybeSingle();

    if (existingRequest) {
      toast.error("Une demande d'ami existe déjà avec ce profil");
      return;
    }

    // Send friend request
    const { error } = await supabase
      .from("friend_requests")
      .insert({
        sender_id: user.id,
        receiver_id: profile.id,
        status: "pending"
      });

    if (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
      return;
    }

    toast.success("Demande d'ami envoyée avec succès");
    setSelectedProfile(null);
  };

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Rechercher des profils</h1>
        <ProfileSearch 
          onSelect={handleProfileSelect}
          placeholder="Rechercher un profil..."
          className="w-full"
        />
      </div>
    </ScrollArea>
  );
}
