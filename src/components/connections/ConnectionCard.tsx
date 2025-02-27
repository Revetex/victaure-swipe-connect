
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ConnectionCardProps {
  profile: UserProfile;
  onProfileClick?: (profile: UserProfile) => void;
}

export function ConnectionCard({ profile, onProfileClick }: ConnectionCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleClickProfile = () => {
    if (onProfileClick) {
      onProfileClick(profile);
    } else {
      setShowProfile(true);
    }
  };

  const handleMessageClick = () => {
    navigate(`/messages?receiver=${profile.id}`);
  };

  const lastSeenText = () => {
    if (profile.online_status) {
      return "En ligne";
    }
    
    if (!profile.last_seen) {
      return "Dernière connexion inconnue";
    }
    
    try {
      const lastSeen = new Date(profile.last_seen);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays > 7) {
        return `Vu le ${format(lastSeen, "d MMMM", { locale: fr })}`;
      } else {
        return `Vu ${formatDistanceToNow(lastSeen, { addSuffix: true, locale: fr })}`;
      }
    } catch (e) {
      return "Dernière connexion inconnue";
    }
  };

  return (
    <>
      <Card className="p-3 overflow-hidden hover:bg-accent/30 transition-colors cursor-pointer" onClick={handleClickProfile}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserAvatar 
                user={{
                  id: profile.id,
                  name: profile.full_name || '',
                  image: profile.avatar_url
                }}
                className="h-10 w-10"
              />
              {profile.online_status && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div>
              <div className="font-medium">{profile.full_name}</div>
              <div className="text-xs text-muted-foreground">{lastSeenText()}</div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleMessageClick();
              }}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Message</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/profile/${profile.id}`)}>
                  Voir le profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/messages?receiver=${profile.id}`)}>
                  Envoyer un message
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => toast.info("Fonctionnalité à venir")}
                  className="text-destructive"
                >
                  Supprimer la connexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
      
      {showProfile && (
        <ProfilePreview
          profile={profile}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          onRequestChat={handleMessageClick}
        />
      )}
    </>
  );
}
