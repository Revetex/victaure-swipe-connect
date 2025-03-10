
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MessageSquare, UserPlus, User, MapPin, Mail, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/profile";

export interface ProfilePreviewCardProps {
  profile: UserProfile;
  onClose: () => void;
  searchQuery?: string;
  showPendingRequests?: boolean;
  selectedProfile?: UserProfile;
  isOpen?: boolean;
}

export function ProfilePreviewCard({ 
  profile, 
  onClose,
  isOpen: controlledIsOpen,
  searchQuery,
  showPendingRequests,
  selectedProfile,
}: ProfilePreviewCardProps) {
  const [isOpen, setIsOpen] = useState(controlledIsOpen !== undefined ? controlledIsOpen : true);
  const { isFriend, isBlocked, isFriendRequestSent, isFriendRequestReceived, isLoading: statusLoading } = useConnectionStatus(profile.id);
  const { handleAddFriend, handleAcceptFriend, handleRemoveFriend, handleToggleBlock, isLoading: actionLoading } = useConnectionActions(profile.id);
  const navigate = useNavigate();

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  const handleCloseDialog = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSendMessage = () => {
    navigate(`/messages/${profile.id}`);
    handleCloseDialog();
  };

  const handleConnectionAction = async () => {
    if (actionLoading) return;

    if (isFriend) {
      await handleRemoveFriend();
    } else if (isFriendRequestReceived) {
      await handleAcceptFriend();
    } else if (isFriendRequestSent) {
      await handleRemoveFriend();
    } else {
      await handleAddFriend();
    }
  };

  const connectionButtonText = {
    true: 'Retirer', // for isFriend
    pending_sent: 'Annuler la demande',
    pending_received: 'Accepter',
    false: 'Ajouter' // for none/default
  }[isFriend ? 'true' : (isFriendRequestSent ? 'pending_sent' : (isFriendRequestReceived ? 'pending_received' : 'false'))] || 'Ajouter';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-background">
        <div className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleCloseDialog}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center space-y-4 mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || "Profile"} />
              <AvatarFallback className="text-lg">
                {profile.full_name?.substring(0, 2).toUpperCase() || "??"} 
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-xl font-medium">{profile.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {profile.bio || "Aucune biographie disponible"}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {profile.role && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{profile.role}</span>
              </div>
            )}
            
            {(profile.city || profile.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {[profile.city, profile.country].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
            
            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
          
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Compétences</h4>
              <div className="flex flex-wrap gap-1">
                {profile.skills.slice(0, 6).map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                ))}
                {profile.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">+{profile.skills.length - 6}</Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-between gap-2">
            <Button variant="default" className="flex-1" onClick={handleSendMessage}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button 
              variant={isFriend ? "destructive" : (isFriendRequestSent ? "outline" : "secondary")} 
              className="flex-1" 
              onClick={handleConnectionAction}
              disabled={actionLoading || statusLoading}
            >
              <UserPlus className={cn("h-4 w-4 mr-2", isFriend && "hidden")} />
              {connectionButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// For backwards compatibility
export const ProfileCard = ProfilePreviewCard;
