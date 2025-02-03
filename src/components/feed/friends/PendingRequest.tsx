import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
import type { PendingRequest as PendingRequestType } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import { UserProfile } from "@/types/profile";

interface PendingRequestProps {
  request: PendingRequestType;
  onAccept: (requestId: string, senderId: string, senderName: string) => Promise<void>;
  onReject: (requestId: string, senderName: string) => Promise<void>;
  onCancel: (requestId: string, receiverName: string) => Promise<void>;
}

export function PendingRequest({ request, onAccept, onReject, onCancel }: PendingRequestProps) {
  const [showProfile, setShowProfile] = useState(false);
  const profile = request.type === 'incoming' ? request.sender : request.receiver;

  // Create a complete UserProfile object from the partial profile data
  const userProfile: UserProfile = {
    id: profile.id,
    email: '',  // Required by UserProfile type but not needed for display
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: '',   // Required by UserProfile type but not needed for display
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
      <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg animate-pulse">
        <Avatar 
          className="h-10 w-10 border-2 border-primary/10 cursor-pointer"
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