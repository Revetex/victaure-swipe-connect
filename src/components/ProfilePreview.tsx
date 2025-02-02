import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, MessageCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePreviewProps {
  profile: UserProfile;
  onClose: () => void;
}

export function ProfilePreview({ profile, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour envoyer un message");
        return;
      }

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

      navigate(`/dashboard/messages/${message.id}`);
      toast.success("Conversation créée avec succès");
      onClose();
    } catch (error) {
      console.error("Error in handleMessage:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleFriendRequest = () => {
    // TODO: Implement friend request functionality
    toast.success("Demande d'ami envoyée");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              <UserRound className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold">{profile.full_name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.role}</p>
          </div>

          {profile.bio && (
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 line-clamp-3">
              {profile.bio}
            </p>
          )}

          <div className="flex gap-3 w-full">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleFriendRequest}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
            <Button 
              className="flex-1"
              variant="outline"
              onClick={handleSendMessage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}