
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConnectionStatus } from "@/components/profile/preview/hooks/useConnectionStatus";
import { UserAvatar } from "@/components/UserAvatar";
import { UserProfile, convertOnlineStatusToBoolean } from "@/types/profile";
import { User, UserRoundPlus, UserCheck, MessageCircle, Loader2 } from "lucide-react";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { useNavigate } from "react-router-dom";

interface ConnectionCardProps {
  profile: UserProfile;
  onProfileClick?: (profile: UserProfile) => void;
  className?: string;
}

export function ConnectionCard({ profile, onProfileClick, className }: ConnectionCardProps) {
  const { isFriend, isFriendRequestSent, isFriendRequestReceived } = useConnectionStatus(profile.id);
  const [isLoading, setIsLoading] = useState(false);
  const { sendFriendRequest, acceptFriendRequest, cancelFriendRequest } = useFriendRequests();
  const { setReceiver, setShowConversation } = useReceiver();
  const navigate = useNavigate();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await sendFriendRequest(profile.id);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = () => {
    if (!profile) return;

    // Assurez-vous que online_status est un boolean
    const userWithBooleanStatus = {
      ...profile,
      online_status: convertOnlineStatusToBoolean(profile.online_status)
    };
    
    setReceiver(userWithBooleanStatus);
    setShowConversation(true);
    navigate("/messages");
  };

  const viewProfile = () => {
    if (onProfileClick) {
      onProfileClick(profile);
    } else {
      navigate(`/profile/${profile.id}`);
    }
  };

  // Format last seen
  let lastSeenText = "Dernière connexion inconnue";
  if (profile.online_status) {
    lastSeenText = "En ligne";
  } else if (profile.last_seen) {
    try {
      const lastSeenDate = new Date(profile.last_seen);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 1) {
        lastSeenText = `Dernière connexion ${formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: fr })}`;
      } else if (diffInDays < 7) {
        lastSeenText = `Dernière connexion ${format(lastSeenDate, 'eeee', { locale: fr })}`;
      } else {
        lastSeenText = `Dernière connexion le ${format(lastSeenDate, 'dd MMM yyyy', { locale: fr })}`;
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <div className="relative">
          <UserAvatar 
            user={{ 
              id: profile.id, 
              name: profile.full_name || "", 
              image: profile.avatar_url 
            }} 
            className="h-12 w-12" 
          />
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
              profile.online_status ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold truncate">{profile.full_name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {lastSeenText}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={viewProfile}>
            <User className="h-4 w-4" />
            <span className="sr-only">Voir le profil</span>
          </Button>
          {isFriend ? (
            <Button variant="ghost" size="icon" onClick={startConversation}>
              <MessageCircle className="h-4 w-4" />
              <span className="sr-only">Message</span>
            </Button>
          ) : isFriendRequestSent ? (
            <Button variant="ghost" size="icon" disabled={isLoading} title="Demande envoyée">
              <UserCheck className="h-4 w-4 text-primary" />
              <span className="sr-only">Demande envoyée</span>
            </Button>
          ) : isFriendRequestReceived ? (
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isLoading}
              onClick={() => {
                // TODO: Implement accept friend request
                toast.success("Demande acceptée");
              }}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accepter"}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserRoundPlus className="h-4 w-4" />
              )}
              <span className="sr-only">Connecter</span>
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
