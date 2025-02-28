
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserPlus, MessageSquare, UserX, Shield, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFriendRequests } from "@/hooks/useFriendRequests";

interface ProfileActionsProps {
  profile: UserProfile;
}

export function ProfileActions({ profile }: ProfileActionsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    isFriend: boolean;
    isPending: boolean;
    isReceived: boolean;
    isBlocked: boolean;
  }>({
    isFriend: false,
    isPending: false,
    isReceived: false,
    isBlocked: false
  });
  const { sendFriendRequest, acceptFriendRequest, refetchPendingRequests } = useFriendRequests();

  // Vérifier si c'est le profil de l'utilisateur connecté
  const isOwnProfile = user?.id === profile.id;

  // Fonction pour envoyer un message
  const handleSendMessage = () => {
    navigate(`/messages?receiver=${profile.id}`);
  };

  // Fonction pour ajouter l'utilisateur en ami
  const handleAddFriend = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour cette action");
      return;
    }

    setIsLoading(true);
    try {
      await sendFriendRequest(profile.id);
      setConnectionStatus({ ...connectionStatus, isPending: true });
      toast.success(`Demande d'ami envoyée à ${profile.full_name}`);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Impossible d'envoyer la demande d'ami");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour accepter une demande d'ami
  const handleAcceptFriend = async (requestId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await acceptFriendRequest(requestId);
      setConnectionStatus({ ...connectionStatus, isReceived: false, isFriend: true });
      toast.success(`Vous êtes maintenant ami avec ${profile.full_name}`);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Impossible d'accepter la demande d'ami");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour retirer l'ami
  const handleRemoveFriend = async (connectionId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);
        
      if (error) throw error;
      
      setConnectionStatus({ 
        ...connectionStatus, 
        isFriend: false, 
        isPending: false, 
        isReceived: false 
      });
      
      toast.success(`${profile.full_name} retiré de vos amis`);
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Impossible de retirer cet ami");
    } finally {
      setIsLoading(false);
    }
  };

  // Si c'est le profil de l'utilisateur connecté, ne pas afficher les actions
  if (isOwnProfile) {
    return null;
  }

  // Actions pour un ami
  if (connectionStatus.isFriend) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={handleSendMessage}
          className="flex-1 gap-1.5"
        >
          <MessageSquare className="h-4 w-4" />
          Envoyer un message
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleRemoveFriend("connection-id")} // Remplacer par l'ID réel
          disabled={isLoading}
          className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <UserX className="h-4 w-4" />
          Retirer des amis
        </Button>
      </div>
    );
  }

  // Actions pour une demande d'ami reçue
  if (connectionStatus.isReceived) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          onClick={() => handleAcceptFriend("request-id")} // Remplacer par l'ID réel
          disabled={isLoading}
          className="flex-1 gap-1.5"
        >
          <Check className="h-4 w-4" />
          Accepter
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleRemoveFriend("request-id")} // Remplacer par l'ID réel
          disabled={isLoading}
          className="flex-1 gap-1.5"
        >
          <X className="h-4 w-4" />
          Refuser
        </Button>
      </div>
    );
  }

  // Actions pour une demande d'ami envoyée
  if (connectionStatus.isPending) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => handleRemoveFriend("request-id")} // Remplacer par l'ID réel
          disabled={isLoading}
          className="flex-1 gap-1.5"
        >
          <X className="h-4 w-4" />
          Annuler la demande
        </Button>
      </div>
    );
  }

  // Actions par défaut
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        onClick={handleAddFriend}
        disabled={isLoading}
        className="flex-1 gap-1.5"
      >
        <UserPlus className="h-4 w-4" />
        Ajouter en ami
      </Button>
      <Button
        variant={connectionStatus.isBlocked ? "destructive" : "outline"}
        disabled={isLoading}
        className="flex-none gap-1.5"
      >
        <Shield className="h-4 w-4" />
        {connectionStatus.isBlocked ? "Débloquer" : "Bloquer"}
      </Button>
    </div>
  );
}
