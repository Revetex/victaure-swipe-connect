
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/profile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ToolsGridProps {
  tools: any[];
  onToolClick: (tool: any) => void;
}

export function ToolsGrid({ tools, onToolClick }: ToolsGridProps) {
  const isMobile = useIsMobile();

  const handleProfileSelect = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingRequest } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
      .maybeSingle();

    if (existingRequest) {
      toast.error("Une demande d'ami existe déjà avec ce profil");
      return;
    }

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
  };

  return (
    <div className={cn("w-full p-4 space-y-4")}>
      <h2 className="text-lg font-semibold">Rechercher des profils</h2>
      <ProfileSearch 
        onSelect={handleProfileSelect}
        placeholder="Rechercher un profil..."
        className="w-full"
      />
    </div>
  );
}
