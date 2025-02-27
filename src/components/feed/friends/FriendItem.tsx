
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, UserPlus, X, UserX, MoreHorizontal, UserCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { OnlineStatus, Friend } from "@/types/profile";

interface FriendItemProps {
  friend: Friend;
  isFriend?: boolean;
  isPending?: boolean;
  isSentByMe?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
  onClick?: (friend: Friend) => void;
  showStatus?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

export function FriendItem({
  friend,
  isFriend = false,
  isPending = false,
  isSentByMe = false,
  onAccept,
  onReject,
  onCancel,
  onRemove,
  onClick,
  showStatus = true,
  size = "md",
  variant = "default"
}: FriendItemProps) {
  const { user } = useAuth();
  const { setReceiver, setShowConversation } = useReceiver();
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(isFriend);

  const avatarSizes = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getOnlineStatusColor = (status: OnlineStatus | string | boolean | undefined) => {
    if (status === "online" || status === true) return "bg-green-500";
    if (status === "away") return "bg-yellow-500";
    if (status === "busy") return "bg-red-500";
    return "bg-gray-500";
  };

  const formatLastSeen = (date: string | null | undefined) => {
    if (!date) return "Jamais connecté";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    } catch (error) {
      return "Date inconnue";
    }
  };

  const handleChat = async () => {
    if (!user || !friend) return;

    try {
      setLoading(true);
      
      // Adapter le friend au format Receiver pour le chat
      setReceiver({
        id: friend.id,
        full_name: friend.full_name || "Utilisateur",
        avatar_url: friend.avatar_url || null,
        email: friend.email,
        role: friend.role,
        bio: friend.bio,
        phone: friend.phone,
        city: friend.city,
        state: friend.state,
        country: friend.country,
        online_status: friend.online_status,
        last_seen: friend.last_seen,
        skills: friend.skills || []
      });
      
      setShowConversation(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Impossible de démarrer la conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!user || !friend.id) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_connections')
        .insert({
          sender_id: user.id,
          receiver_id: friend.id,
          status: 'pending'
        });

      if (error) throw error;
      
      setIsConnected(true);
      toast.success("Demande envoyée");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Impossible d'envoyer la demande");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <div 
        className={cn(
          "flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors",
          onClick && "cursor-pointer"
        )}
        onClick={() => onClick?.(friend)}
      >
        <Avatar className={avatarSizes[size]}>
          <AvatarImage src={friend.avatar_url || undefined} alt={friend.full_name || "User"} />
          <AvatarFallback>{getInitials(friend.full_name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{friend.full_name || "Utilisateur"}</p>
        </div>
        {showStatus && friend.online_status && (
          <div className={`${getOnlineStatusColor(friend.online_status)} h-2.5 w-2.5 rounded-full`} />
        )}
      </div>
    );
  }

  return (
    <Card className="p-4 mb-2 overflow-hidden group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className={avatarSizes[size]}>
            <AvatarImage src={friend.avatar_url || undefined} alt={friend.full_name || "User"} />
            <AvatarFallback>{getInitials(friend.full_name)}</AvatarFallback>
          </Avatar>
          {showStatus && friend.online_status && (
            <div 
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900",
                getOnlineStatusColor(friend.online_status)
              )} 
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold truncate">{friend.full_name || "Utilisateur"}</h4>
              {friend.last_seen && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {friend.online_status === "online" || friend.online_status === true 
                    ? "En ligne" 
                    : `Vu ${formatLastSeen(friend.last_seen)}`}
                </p>
              )}
              {friend.role && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {friend.role === "professional" ? "Professionnel" : 
                   friend.role === "business" ? "Entreprise" : 
                   friend.role === "student" ? "Étudiant" : 
                   friend.role === "admin" ? "Admin" : "Utilisateur"}
                </Badge>
              )}
            </div>
            
            <div className="flex gap-1">
              {/* Actions conditionnelles selon le statut */}
              {isFriend && (
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleChat}
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-500 cursor-pointer"
                        onClick={() => onRemove?.(friend.id)}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        <span>Retirer des amis</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              
              {isPending && !isSentByMe && (
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8"
                    onClick={() => onAccept?.(friend.id)}
                    disabled={loading}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    <span>Accepter</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8"
                    onClick={() => onReject?.(friend.id)}
                    disabled={loading}
                  >
                    <X className="mr-1 h-4 w-4" />
                    <span>Refuser</span>
                  </Button>
                </div>
              )}
              
              {isPending && isSentByMe && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  onClick={() => onCancel?.(friend.id)}
                  disabled={loading}
                >
                  <span>Annuler</span>
                </Button>
              )}
              
              {!isFriend && !isPending && !isConnected && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  onClick={handleSendRequest}
                  disabled={loading}
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  <span>Ajouter</span>
                </Button>
              )}
              
              {isConnected && !isFriend && !isPending && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  disabled={true}
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  <span>Demande envoyée</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
