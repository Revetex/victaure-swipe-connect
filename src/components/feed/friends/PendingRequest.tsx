import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
import type { PendingRequest as PendingRequestType } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface PendingRequestProps {
  request: PendingRequestType;
  onAccept: (requestId: string, senderId: string, senderName: string) => Promise<void>;
  onReject: (requestId: string, senderName: string) => Promise<void>;
  onCancel: (requestId: string, receiverName: string) => Promise<void>;
}

export function PendingRequest({ request, onAccept, onReject, onCancel }: PendingRequestProps) {
  const [showProfile, setShowProfile] = useState(false);
  const profile = request.type === 'incoming' ? request.sender : request.receiver;

  const userProfile: UserProfile = {
    id: profile.id,
    email: '',
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: '',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: [],
    latitude: null,
    longitude: null
  };

  return (
    <>
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        "bg-primary/5 border border-primary/10",
        "animate-pulse transition-all duration-200"
      )}>
        <Avatar 
          className="h-10 w-10 border-2 border-primary/10 cursor-pointer hover:border-primary/20 transition-colors"
          onClick={() => setShowProfile(true)}
        >
          <AvatarImage 
            src={profile.avatar_url} 
            alt={profile.full_name} 
          />
          <AvatarFallback>
            {profile.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setShowProfile(true)}
        >
          <p className="font-medium truncate">
            {profile.full_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {request.type === 'incoming' 
              ? "Souhaite vous ajouter comme ami" 
              : "Demande envoyée"}
          </p>
        </div>
        <div className="flex gap-2">
          {request.type === 'incoming' ? (
            <>
              <Button
                size="sm"
                variant="default"
                className="h-8 px-3"
                onClick={() => onAccept(request.id, request.sender.id, request.sender.full_name)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3"
                onClick={() => onReject(request.id, request.sender.full_name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={() => onCancel(request.id, request.receiver.full_name)}
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showProfile && (
        <ProfilePreview
          profile={userProfile}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}