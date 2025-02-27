
import { useState } from "react";
import { DashboardShell } from "@/components/shell/DashboardShell";
import { DashboardHeader } from "@/components/shell/DashboardHeader";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";

export function ProfileSearchPage() {
  const navigate = useNavigate();
  const { sendFriendRequest } = useFriendRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRequest = async (profile: UserProfile): Promise<void> => {
    try {
      setIsSubmitting(true);
      await sendFriendRequest(profile.id);
      // Ne rien retourner pour s'assurer que le type est Promise<void>
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Rechercher des personnes"
        text="Trouvez et ajoutez de nouveaux amis"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/friends")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        <ProfileSearch 
          onSelect={handleSendRequest} 
          placeholder="Rechercher par nom..."
          className="max-w-2xl"
        />
        
        <div className="text-sm text-muted-foreground mt-2">
          <p>
            Recherchez des utilisateurs par nom pour les ajouter à vos contacts.
            Vous pouvez également filtrer par compétences ou localisation.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
