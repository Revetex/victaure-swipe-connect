
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, MoreHorizontal, UserX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useReceiver } from "@/hooks/useReceiver";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ConnectionCardProps {
  profile: UserProfile;
}

export function ConnectionCard({ profile }: ConnectionCardProps) {
  const { setReceiver, setShowConversation } = useReceiver();
  const navigate = useNavigate();
  const { handleRemoveFriend } = useConnectionActions();
  const [isRemoving, setIsRemoving] = useState(false);
  const { user } = useAuth();
  
  const handleMessage = () => {
    // Configure receiver for conversation
    setReceiver({
      id: profile.id,
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url,
      online_status: profile.online_status
    });
    
    setShowConversation(true);
    navigate('/messages');
  };
  
  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`);
  };
  
  const handleRemove = async () => {
    if (isRemoving) return;
    
    try {
      setIsRemoving(true);
      
      // Utiliser handleRemoveFriend du hook useConnectionActions
      await handleRemoveFriend();
      
      // Alternative directe si handleRemoveFriend ne fonctionne pas
      if (user?.id) {
        await supabase
          .from('user_connections')
          .delete()
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`);
        
        toast.success(`${profile.full_name || 'Connexion'} supprimé(e)`);
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      toast.error("Erreur lors de la suppression de la connexion");
    } finally {
      setIsRemoving(false);
    }
  };
  
  const formattedLastSeen = profile.last_seen 
    ? formatDistanceToNow(new Date(profile.last_seen), { addSuffix: true, locale: fr })
    : "Récemment";

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-md border border-zinc-800 transition-all">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-zinc-700">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ""} />
            <AvatarFallback>{profile.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          {profile.online_status && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900"></span>
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-white">{profile.full_name}</h4>
          <p className="text-xs text-zinc-400">
            {profile.online_status ? "En ligne" : `Vu ${formattedLastSeen}`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={handleMessage}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={handleViewProfile}
        >
          <User className="h-4 w-4" />
          <span className="sr-only">Profil</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px] bg-zinc-900 border-zinc-800">
            <DropdownMenuItem 
              onClick={handleViewProfile}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Voir le profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleMessage}
              className="cursor-pointer"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Envoyer un message</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
              disabled={isRemoving}
            >
              <UserX className="mr-2 h-4 w-4" />
              <span>Retirer la connexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
