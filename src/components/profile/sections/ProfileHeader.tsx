
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";

interface ProfileHeaderProps {
  profile: UserProfile;
  onClose: () => void;
  canViewFullProfile?: boolean;
}

export function ProfileHeader({ 
  profile, 
  onClose,
  canViewFullProfile = true
}: ProfileHeaderProps) {
  // Get the formatted role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'professional':
        return 'Professionnel';
      case 'business':
        return 'Entreprise';
      case 'admin':
        return 'Administrateur';
      default:
        return role;
    }
  };

  return (
    <div className={cn(
      "flex flex-col p-5",
      "bg-card/70",
      "border-b border-border/30"
    )}>
      <div className="flex justify-between items-start mb-3">
        <UserAvatar 
          user={profile} 
          className="h-16 w-16 border-2 border-background/70 shadow-sm" 
          fallbackClassName="bg-background/50 text-foreground font-semibold"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="rounded-full h-8 w-8 bg-background/20 hover:bg-background/30"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </Button>
      </div>
      
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{profile.full_name}</h2>
        
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          {profile.role && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
              {getRoleLabel(profile.role)}
            </span>
          )}
          
          {profile.city && (
            <span className="text-foreground/70">
              {profile.city}{profile.country ? `, ${profile.country}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
