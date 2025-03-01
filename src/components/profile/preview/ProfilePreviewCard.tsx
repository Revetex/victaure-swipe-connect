
import React from 'react';
import { UserProfile } from '@/types/profile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/utils/text-formatters';

interface ProfileCardProps {
  profile: UserProfile;
  onSelect?: (profile: UserProfile) => void;
  actionLabel?: string;
  showAction?: boolean;
}

export function ProfileCard({ profile, onSelect, actionLabel = 'View Profile', showAction = true }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
          <AvatarFallback>{getInitials(profile.full_name || 'User')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{profile.full_name}</h3>
          <p className="text-sm text-muted-foreground">{profile.job_title || profile.role}</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {profile.bio && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{profile.bio}</p>
        )}
        
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{profile.skills.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {showAction && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => onSelect && onSelect(profile)}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function (typically in utils, but added here for completeness)
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
