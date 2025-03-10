
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MessageSquare, UserPlus, User, MapPin, Mail, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { useNavigate } from "react-router-dom";

interface ProfilePreviewCardProps {
  profile: any;
  onClose: () => void;
}

export function ProfilePreviewCard({ profile, onClose }: ProfilePreviewCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { status, isLoading: statusLoading } = useConnectionStatus(profile.id);
  const { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, removeFriend, isLoading: actionLoading } = useConnectionActions();
  const navigate = useNavigate();

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

    if (status === 'none') {
      await sendFriendRequest(profile.id);
    } else if (status === 'pending_sent') {
      await cancelFriendRequest(profile.id);
    } else if (status === 'pending_received') {
      await acceptFriendRequest(profile.id);
    } else if (status === 'accepted') {
      await removeFriend(profile.id);
    }
  };

  const connectionButtonText = {
    none: 'Ajouter',
    pending_sent: 'Annuler la demande',
    pending_received: 'Accepter',
    accepted: 'Retirer'
  }[status] || 'Ajouter';

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
              variant={status === 'accepted' ? "destructive" : (status === 'pending_sent' ? "outline" : "secondary")} 
              className="flex-1" 
              onClick={handleConnectionAction}
              disabled={actionLoading || statusLoading}
            >
              <UserPlus className={cn("h-4 w-4 mr-2", status === 'accepted' && "hidden")} />
              {connectionButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
