
import { UserProfile } from "@/types/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { RotateCw, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onFlip: () => void;
  onRequestChat?: () => void;
  onImageClick?: () => void;
  canViewFullProfile: boolean;
}

export function ProfilePreviewFront({ 
  profile, 
  onFlip, 
  onRequestChat, 
  onImageClick, 
  canViewFullProfile 
}: ProfilePreviewFrontProps) {
  // Fonction utilitaire pour détecter les appareils mobiles
  const isMobile = window.innerWidth < 768;

  return (
    <div className={cn(
      "absolute inset-0 backface-hidden",
      "flex flex-col p-6",
      "bg-gradient-to-br from-card/90 to-card",
      "rounded-lg overflow-hidden"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div 
          className="relative cursor-pointer" 
          onClick={onImageClick}
        >
          <UserAvatar 
            user={profile} 
            className="h-24 w-24 border-4 border-background/20 shadow-xl" 
            fallbackClassName="bg-primary/10 text-primary font-semibold text-2xl"
          />
          {profile.online_status && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card"></span>
          )}
        </div>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onFlip}
          className="h-8 w-8 rounded-full bg-background/30 hover:bg-background/50"
        >
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Retourner</span>
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">{profile.full_name}</h2>
        {profile.role && (
          <p className="text-muted-foreground">{profile.role}</p>
        )}
        
        {/* Localisation */}
        {profile.city && (
          <p className="text-sm text-muted-foreground mt-1">
            {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">À propos</h3>
          <p className="text-sm text-muted-foreground line-clamp-4">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Compétences */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-auto">
          <h3 className="text-sm font-medium mb-2">Compétences</h3>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {profile.skills.map((skill, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Actions en bas de la carte */}
      <div className="mt-4 pt-4 border-t border-border/30">
        {!canViewFullProfile && (
          <div className="mb-4 p-2 text-sm text-amber-600 bg-amber-100/10 rounded-md">
            <p>Profil privé - Certaines informations sont masquées</p>
          </div>
        )}
        
        {onRequestChat && !isMobile && (
          <Button 
            onClick={onRequestChat}
            className="w-full"
            variant="outline"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Envoyer un message
          </Button>
        )}
      </div>
    </div>
  );
}
