
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
      "flex flex-col p-6",
      "bg-gradient-to-br from-primary/30 via-primary/10 to-background",
      "border-b border-border/10",
      "backdrop-filter backdrop-blur-sm"
    )}>
      <div className="flex justify-between items-start mb-4">
        <UserAvatar 
          user={profile} 
          className="h-20 w-20 border-4 border-background/70 shadow-md" 
          fallbackClassName="bg-background/70 text-foreground font-semibold"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="rounded-full h-8 w-8 bg-background/30 hover:bg-background/50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </Button>
      </div>
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold">{profile.full_name}</h2>
        
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          {profile.role && (
            <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full text-xs">
              {getRoleLabel(profile.role)}
            </span>
          )}
          
          {profile.city && (
            <span className="text-foreground/70">{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
}
