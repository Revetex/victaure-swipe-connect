
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { ConversationHeaderProps } from "@/types/messages";
import { ProfilePreviewCard } from "@/components/profile/preview/ProfilePreviewCard";
import { Receiver } from "@/types/messages";

export function ConversationHeader({ 
  name, 
  avatar, 
  isOnline, 
  receiver,
  onBack,
  onClose
}: ConversationHeaderProps) {
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <div className="flex items-center justify-between p-3 border-b border-[#64B5D9]/10">
      <div className="flex items-center">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden" 
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Button>
        )}

        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setShowProfile(true)}
        >
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage src={avatar || ""} alt={name} />
            <AvatarFallback>
              {name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-base leading-none">{name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isOnline ? (
                <span className="text-green-500">En ligne</span>
              ) : (
                "Hors ligne"
              )}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
          <span className="sr-only">Appel audio</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
          <span className="sr-only">Appel vidéo</span>
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">Plus d'options</span>
        </Button>
      </div>

      {showProfile && receiver && (
        <ProfilePreviewCard
          profile={receiver as any}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
