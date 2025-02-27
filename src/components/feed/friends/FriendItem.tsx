
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MoreHorizontal, UserMinus, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface FriendItemProps {
  friend: UserProfile;
  onRemove?: () => void;
}

export function FriendItem({ friend, onRemove }: FriendItemProps) {
  const navigate = useNavigate();
  const { setShowConversation, setReceiver } = useReceiver();
  const { user } = useAuth();
  const [isRemoving, setIsRemoving] = useState(false);

  // Format last seen date/time
  const getLastSeenText = () => {
    if (friend.online_status) return "En ligne";
    if (!friend.last_seen) return "Hors ligne";

    try {
      const lastSeenDate = new Date(friend.last_seen);
      if (isToday(lastSeenDate)) {
        return `Dernière connexion ${formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: fr })}`;
      } else {
        return `Dernière connexion le ${format(lastSeenDate, 'dd MMM yyyy à HH:mm', { locale: fr })}`;
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Hors ligne";
    }
  };

  const handleMessage = () => {
    if (!friend || !user) return;

    // Navigation vers la page de messages
    navigate("/messages");

    // Configuration des paramètres pour afficher la conversation
    setReceiver({
      id: friend.id,
      full_name: friend.full_name || "",
      avatar_url: friend.avatar_url,
      online_status: (typeof friend.online_status === 'string') ? 
        (friend.online_status as 'online' | 'offline') :
        (friend.online_status ? 'online' : 'offline'),
      last_seen: friend.last_seen,
      role: friend.role,
      skills: friend.skills || [],
      city: friend.city,
      state: friend.state,
      country: friend.country,
      bio: friend.bio || "",
      phone: friend.phone || "",
    });
    
    // Afficher la conversation
    setShowConversation(true);
    
    toast.success(`Discussion avec ${friend.full_name}`);
  };

  const handleRemoveFriend = async () => {
    if (!user || !friend.id || isRemoving) return;
    
    try {
      setIsRemoving(true);
      
      // Obtenir l'ID de la connexion
      const { data: connections, error: fetchError } = await supabase
        .from('user_connections')
        .select('id')
        .eq('status', 'accepted')
        .eq('connection_type', 'friend')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${user.id})`)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Supprimer la connexion
      const { error: deleteError } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connections.id);
      
      if (deleteError) throw deleteError;
      
      toast.success(`${friend.full_name} a été retiré(e) de vos connexions`);
      
      // Callback pour mettre à jour la liste
      if (onRemove) onRemove();
      
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Erreur lors de la suppression de la connexion");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex items-center justify-between",
        "p-3 pr-2",
        "border border-zinc-800/50",
        "rounded-md",
        "bg-zinc-900/30 hover:bg-zinc-900/60",
        "backdrop-blur-sm",
        "overflow-hidden",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-zinc-700/50">
            <AvatarImage src={friend.avatar_url || undefined} alt={friend.full_name || ""} />
            <AvatarFallback>
              {friend.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div 
            className={cn(
              "absolute bottom-0 right-0",
              "h-3 w-3 rounded-full",
              "border-2 border-zinc-900",
              friend.online_status ? "bg-green-500" : "bg-zinc-500"
            )}
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white">
            {friend.full_name}
          </div>
          <p className="truncate text-xs text-zinc-400">
            {getLastSeenText()}
          </p>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleMessage}
          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-zinc-900 border-zinc-800 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              onClick={handleRemoveFriend}
              disabled={isRemoving}
              className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              <span>Retirer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
