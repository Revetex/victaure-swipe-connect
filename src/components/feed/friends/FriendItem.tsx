
import { useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserRoundX, MoreHorizontal, UserRoundPlus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { Receiver } from "@/types/messages";
import { Friend } from "@/types/profile";

interface FriendItemProps {
  friend: Friend;
  onRemove?: () => void;
}

export function FriendItem({ friend, onRemove }: FriendItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setReceiver, setShowConversation } = useReceiver();

  const handleRemoveFriend = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Suppression dans les deux sens (sender et receiver)
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted');

      if (error) throw error;
      
      toast.success("Ami supprimé");
      setIsOpen(false);
      
      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de l'ami");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Supprimer d'abord la relation d'amitié
      await handleRemoveFriend();
      
      // Puis ajouter à la liste des utilisateurs bloqués
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: friend.id
        });
        
      if (error) throw error;
      
      toast.success(`${friend.full_name} a été bloqué`);
      setIsOpen(false);
      
      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error("Erreur lors du blocage de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${friend.id}`);
  };

  const handleChat = () => {
    const receiverData: Receiver = {
      id: friend.id,
      full_name: friend.full_name || '',
      avatar_url: friend.avatar_url,
      role: 'professional', // valeur par défaut
      online_status: friend.online_status ? 'online' : 'offline',
      last_seen: friend.last_seen || null,
      bio: null,
      phone: null,
      city: null,
      state: null,
      country: '',
      email: null,
      skills: [],
      latitude: null,
      longitude: null,
      certifications: [],
      education: [],
      experiences: [],
      friends: []
    };
    
    setReceiver(receiverData);
    setShowConversation(true);
    navigate('/messages');
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <UserAvatar 
            user={{ 
              id: friend.id, 
              name: friend.full_name || '',
              image: friend.avatar_url 
            }} 
            className="h-10 w-10"
          />
          {friend.online_status && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-1 ring-white" />
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium">{friend.full_name}</h4>
          <p className="text-xs text-muted-foreground">
            {friend.online_status ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleViewProfile}
          className="h-8 w-8"
        >
          <UserRoundPlus className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={handleChat}
          className="h-8 w-8"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gérer la relation</DialogTitle>
              <DialogDescription>
                Choisissez une action à effectuer concernant {friend.full_name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-3 py-4">
              <Button 
                variant="outline" 
                className="justify-start gap-2"
                onClick={handleRemoveFriend}
                disabled={isLoading}
              >
                <UserRoundX className="h-4 w-4" />
                <span>Supprimer des amis</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2 text-destructive hover:text-destructive"
                onClick={handleBlockUser}
                disabled={isLoading}
              >
                <UserRoundX className="h-4 w-4" />
                <span>Bloquer l'utilisateur</span>
              </Button>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
