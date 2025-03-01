
import React from 'react';
import { UserProfile } from '@/types/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatNameInitials } from '@/utils/text-formatters';

interface ProfileCardProps {
  profile: UserProfile;
  onConnect?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
}

export function ProfilePreviewCard({ profile, onConnect, onMessage, onViewProfile }: ProfileCardProps) {
  return (
    <Card className="w-full border border-zinc-800/50 bg-black/40 backdrop-blur-sm text-white">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
          <AvatarFallback className="bg-primary/20 text-primary-foreground">
            {formatNameInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{profile.full_name}</h3>
          {profile.job_title && (
            <p className="text-sm text-zinc-400">{profile.job_title}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {profile.bio && (
          <p className="text-sm text-zinc-300 mb-4 line-clamp-2">{profile.bio}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {onViewProfile && (
            <Button variant="outline" size="sm" onClick={onViewProfile} className="flex-1">
              View Profile
            </Button>
          )}
          {onConnect && (
            <Button variant="outline" size="sm" onClick={onConnect} className="flex-1">
              Connect
            </Button>
          )}
          {onMessage && (
            <Button variant="outline" size="sm" onClick={onMessage} className="flex-1">
              Message
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
