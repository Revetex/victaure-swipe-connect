import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound, MessageCircle, UserPlus, Briefcase, MapPin, Mail, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

interface ProfilePreviewProps {
  profile: UserProfile;
  onClose: () => void;
}

export function ProfilePreview({ profile, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  const handleSendMessage = () => {
    navigate(`/dashboard/messages/${profile.id}`);
    toast.success("Redirection vers la messagerie");
    onClose();
  };

  const handleFriendRequest = () => {
    if (isFriendRequestSent) {
      toast.success("Demande d'ami annulée");
      setIsFriendRequestSent(false);
    } else {
      toast.success("Demande d'ami envoyée");
      setIsFriendRequestSent(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card dark:bg-card/95 rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center space-y-6">
          <Avatar className="h-24 w-24 ring-2 ring-primary/10">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              <UserRound className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">{profile.full_name}</h3>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <p className="text-sm">{profile.role}</p>
            </div>
            
            {(profile.city || profile.country) && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <p className="text-sm">{[profile.city, profile.country].filter(Boolean).join(", ")}</p>
              </div>
            )}
            
            {profile.email && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <p className="text-sm">{profile.email}</p>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-sm text-center text-muted-foreground/90 border-t border-border/50 pt-4">
              {profile.bio}
            </p>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="w-full">
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.skills.slice(0, 5).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <Button 
              className={`flex-1 ${isFriendRequestSent ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
              onClick={handleFriendRequest}
            >
              {isFriendRequestSent ? (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Annuler
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </>
              )}
            </Button>
            <Button 
              className="flex-1"
              variant="outline"
              onClick={handleSendMessage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}