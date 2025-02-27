
import { UserProfile, Friend, Receiver } from "@/types/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { useState } from "react";
import { 
  MoreHorizontal, 
  MessageCircle, 
  UserX, 
  User, 
  Clock, 
  Loader2 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FriendCardProps {
  friend: UserProfile | Friend;
  onRemove: () => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleMessage = () => {
    // Create a compatible Receiver object from the friend data
    const receiverData: Receiver = {
      id: friend.id,
      full_name: friend.full_name || '',
      avatar_url: friend.avatar_url,
      email: 'friend.email' in friend ? friend.email : '',
      online_status: typeof friend.online_status === 'boolean' 
        ? (friend.online_status ? 'online' : 'offline') 
        : (friend.online_status || 'offline'),
      last_seen: friend.last_seen,
      latitude: 'latitude' in friend ? friend.latitude : 0,
      longitude: 'longitude' in friend ? friend.longitude : 0
    };
    
    setReceiver(receiverData);
    setShowConversation(true);
    navigate('/messages');
  };

  const handleProfile = () => {
    navigate(`/profile/${friend.id}`);
  };

  const handleRemoveFriend = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get the friendship connection ID
      const { data: connection, error: fetchError } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .eq('connection_type', 'friend')
        .single();
      
      if (fetchError) throw fetchError;
      
      if (connection) {
        // Remove the connection
        const { error: removeError } = await supabase.rpc('remove_friend', {
          p_connection_id: connection.id,
          p_user_id: user.id
        });
        
        if (removeError) throw removeError;
        
        toast.success(`${friend.full_name} retiré de vos connexions`);
        onRemove();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedLastSeen = friend.last_seen 
    ? formatDistanceToNow(new Date(friend.last_seen), { addSuffix: true, locale: fr })
    : "Récemment";

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex items-center justify-between p-3 bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/40 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              user={{
                id: friend.id,
                name: friend.full_name || '',
                image: friend.avatar_url
              }}
              className="h-10 w-10 border border-zinc-700"
            />
            {friend.online_status && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white">{friend.full_name}</h4>
            <div className="flex items-center gap-1 text-xs text-white/50">
              {friend.online_status ? (
                <span className="text-green-400">En ligne</span>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  <span>{formattedLastSeen}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMessage}
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleProfile}
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800"
          >
            <User className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
              <DropdownMenuItem
                className="text-sm cursor-pointer hover:bg-zinc-800"
                onClick={handleProfile}
              >
                <User className="h-4 w-4 mr-2" />
                Voir le profil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm cursor-pointer hover:bg-zinc-800"
                onClick={handleMessage}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Envoyer un message
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="text-sm text-red-400 cursor-pointer hover:bg-red-900/20 hover:text-red-400"
                onClick={handleRemoveFriend}
                disabled={isLoading}
              >
                <UserX className="h-4 w-4 mr-2" />
                Retirer la connexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}

export function FriendCardSkeleton() {
  return (
    <Card className="flex items-center justify-between p-3 bg-zinc-900/30 border-zinc-800">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
        <div>
          <Skeleton className="h-4 w-28 mb-1 bg-zinc-800" />
          <Skeleton className="h-3 w-16 bg-zinc-800" />
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
        <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
        <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
      </div>
    </Card>
  );
}
