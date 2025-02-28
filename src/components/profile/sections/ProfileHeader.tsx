
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6",
        "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent",
        "border-b border-border/10",
        "backdrop-filter backdrop-blur-sm"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <UserAvatar 
            user={profile} 
            className="h-16 w-16 border-4 border-background/70 shadow-md" 
            fallbackClassName="bg-background/70 text-foreground font-semibold"
          />
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {profile.full_name}
            </h2>
            
            <div className="flex flex-wrap items-center gap-2">
              {profile.role && (
                <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full text-xs">
                  {getRoleLabel(profile.role)}
                </span>
              )}
              
              {profile.city && (
                <span className="text-foreground/70 text-sm">
                  {profile.city}{profile.country ? `, ${profile.country}` : ''}
                </span>
              )}
              
              {profile.online_status && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  En ligne
                </span>
              )}
            </div>
          </div>
        </div>
        
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
    </motion.div>
  );
}
