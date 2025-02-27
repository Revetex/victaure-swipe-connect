
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import useConnections from "./hooks/useConnections";
import { toast } from "sonner";

interface ConnectionCardProps {
  connection: UserProfile;
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();
  const { handleSendFriendRequest } = useConnections();

  const handleConnect = async () => {
    try {
      await handleSendFriendRequest(connection.id);
      toast.success(`Demande d'ami envoyée à ${connection.full_name}`);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  const handleChat = () => {
    setReceiver({
      id: connection.id,
      full_name: connection.full_name,
      avatar_url: connection.avatar_url,
      email: connection.email,
      role: connection.role,
      bio: connection.bio,
      phone: connection.phone,
      city: connection.city,
      state: connection.state,
      country: connection.country || '',
      skills: connection.skills || [],
      online_status: connection.online_status ? 'online' : 'offline',
      last_seen: connection.last_seen,
      latitude: null,
      longitude: null,
      certifications: connection.certifications || [],
      education: connection.education || [],
      experiences: connection.experiences || [],
      friends: []
    });
    setShowConversation(true);
    navigate('/messages');
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={connection.avatar_url || undefined} />
          <AvatarFallback>{connection.full_name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div>
          <h4 className="text-sm font-medium">{connection.full_name}</h4>
          {connection.bio && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {connection.bio}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleConnect}
          className="text-xs"
        >
          <UserPlus className="h-3.5 w-3.5 mr-1" />
          Connecter
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleChat}
          className="text-xs"
        >
          <MessageCircle className="h-3.5 w-3.5 mr-1" />
          Message
        </Button>
      </div>
    </div>
  );
}
