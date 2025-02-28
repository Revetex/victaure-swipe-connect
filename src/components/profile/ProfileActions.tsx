
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, UserX, Shield, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export interface ProfileActionsProps {
  profileId: string;
}

export function ProfileActions({ profileId }: ProfileActionsProps) {
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  useEffect(() => {
    const checkRelationship = async () => {
      if (!currentUser) return;
      
      try {
        // Vérifier si amis ou demande en attente
        const { data: connections, error } = await supabase
          .from('user_connections')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${currentUser.id})`);
        
        if (error) {
          console.error('Error checking friendship:', error);
          return;
        }
        
        if (connections && connections.length > 0) {
          const acceptedConnection = connections.find(c => c.status === 'accepted');
          const pendingConnection = connections.find(c => c.status === 'pending');
          
          setIsFriend(!!acceptedConnection);
          setIsPending(!!pendingConnection);
        }
        
        // Vérifier si bloqué
        const { data: blockData } = await supabase
          .from('blocked_users')
          .select('*')
          .eq('blocker_id', currentUser.id)
          .eq('blocked_id', profileId)
          .maybeSingle();
        
        setIsBlocked(!!blockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking relationship:', error);
        setIsLoading(false);
      }
    };
    
    if (currentUser && profileId) {
      checkRelationship();
    }
  }, [currentUser, profileId]);
  
  const handleAddFriend = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await friendRequestsAdapter.createFriendRequest(currentUser.id, profileId);
      
      if (error) throw error;
      toast.success("Demande d'ami envoyée");
      setIsPending(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };
  
  const handleAcceptFriend = async () => {
    if (!currentUser) return;
    
    try {
      // Trouver l'ID de la demande
      const { data: connections } = await supabase
        .from('user_connections')
        .select('id')
        .eq('sender_id', profileId)
        .eq('receiver_id', currentUser.id)
        .eq('status', 'pending')
        .maybeSingle();
      
      if (!connections) {
        toast.error("Demande non trouvée");
        return;
      }
      
      const { error } = await friendRequestsAdapter.acceptFriendRequest(connections.id);
      
      if (error) throw error;
      toast.success("Demande acceptée");
      setIsPending(false);
      setIsFriend(true);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };
  
  const handleRemoveFriend = async () => {
    if (!currentUser) return;
    
    try {
      const { data: connections } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${currentUser.id})`)
        .eq('status', 'accepted');
      
      if (!connections || connections.length === 0) {
        toast.error("Connexion non trouvée");
        return;
      }
      
      for (const connection of connections) {
        const { error } = await friendRequestsAdapter.deleteFriendRequest(connection.id);
        if (error) throw error;
      }
      
      toast.success("Ami retiré");
      setIsFriend(false);
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de l'ami");
    }
  };
  
  const handleCancelRequest = async () => {
    if (!currentUser) return;
    
    try {
      const { data: connections } = await supabase
        .from('user_connections')
        .select('id')
        .eq('sender_id', currentUser.id)
        .eq('receiver_id', profileId)
        .eq('status', 'pending')
        .maybeSingle();
      
      if (!connections) {
        toast.error("Demande non trouvée");
        return;
      }
      
      const { error } = await friendRequestsAdapter.deleteFriendRequest(connections.id);
      
      if (error) throw error;
      toast.success("Demande annulée");
      setIsPending(false);
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error("Erreur lors de l'annulation de la demande");
    }
  };
  
  const handleToggleBlock = async () => {
    if (!currentUser) return;
    
    try {
      if (isBlocked) {
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', currentUser.id)
          .eq('blocked_id', profileId);
        
        if (error) throw error;
        toast.success("Utilisateur débloqué");
        setIsBlocked(false);
      } else {
        const { error } = await supabase
          .from('blocked_users')
          .insert({
            blocker_id: currentUser.id,
            blocked_id: profileId
          });
        
        if (error) throw error;
        toast.success("Utilisateur bloqué");
        setIsBlocked(true);
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      toast.error("Erreur lors du blocage/déblocage");
    }
  };
  
  const handleRequestCV = async () => {
    if (!currentUser) return;
    
    try {
      await supabase.from('notifications').insert({
        user_id: profileId,
        title: "Demande de CV",
        message: `${currentUser.email} aimerait consulter votre CV`,
        type: "cv_request"
      });
      
      toast.success("Demande de CV envoyée");
    } catch (error) {
      console.error('Error requesting CV:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };
  
  if (isLoading || !currentUser) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button disabled>
          <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
          Chargement...
        </Button>
      </div>
    );
  }
  
  // Ne pas afficher les boutons si c'est notre propre profil
  if (currentUser.id === profileId) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {!isFriend && !isPending && (
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          onClick={handleAddFriend}
        >
          <UserPlus className="h-4 w-4" />
          Ajouter
        </Button>
      )}
      
      {isPending && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleCancelRequest}
        >
          <UserX className="h-4 w-4" />
          Annuler la demande
        </Button>
      )}
      
      {isFriend && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleRemoveFriend}
        >
          <UserX className="h-4 w-4" />
          Retirer
        </Button>
      )}
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleRequestCV}
      >
        <FileText className="h-4 w-4" />
        Demander CV
      </Button>
      
      <Button 
        variant={isBlocked ? "destructive" : "outline"} 
        className="flex items-center gap-2"
        onClick={handleToggleBlock}
      >
        <Shield className="h-4 w-4" />
        {isBlocked ? "Débloquer" : "Bloquer"}
      </Button>
    </div>
  );
}
