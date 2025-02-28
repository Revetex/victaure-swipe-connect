
import { UserProfile } from "@/types/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { RotateCw, MessageSquare, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onFlip: () => void;
  onRequestChat?: () => void;
  onImageClick?: () => void;
  canViewFullProfile: boolean;
  onViewProfile?: () => void;
}

export function ProfilePreviewFront({ 
  profile, 
  onFlip, 
  onRequestChat, 
  onImageClick, 
  canViewFullProfile,
  onViewProfile
}: ProfilePreviewFrontProps) {
  // Fonction utilitaire pour détecter les appareils mobiles
  const isMobile = window.innerWidth < 768;

  return (
    <div className={cn(
      "absolute inset-0 backface-hidden",
      "flex flex-col p-6",
      "bg-gradient-to-br from-card/90 via-card/80 to-card/70",
      "rounded-lg overflow-hidden backdrop-blur-sm"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div 
          className="relative cursor-pointer" 
          onClick={onImageClick}
        >
          <UserAvatar 
            user={profile} 
            className="h-24 w-24 border-4 border-background/20 shadow-lg hover:shadow-xl transition-all duration-300" 
            fallbackClassName="bg-primary/10 text-primary font-semibold text-2xl"
          />
          {profile.online_status && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card animate-pulse"></span>
          )}
        </div>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onFlip}
          className="h-8 w-8 rounded-full bg-background/30 hover:bg-background/50 transition-colors duration-300"
        >
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Retourner</span>
        </Button>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {profile.full_name}
        </h2>
        {profile.role && (
          <p className="text-muted-foreground">{profile.role}</p>
        )}
        
        {/* Localisation */}
        {profile.city && (
          <p className="text-sm text-muted-foreground/80 mt-1 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60"></span>
            {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {/* Bio simplifiée */}
      {profile.bio && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-background/20 p-3 rounded-lg border border-border/20"
        >
          <p className="text-sm text-muted-foreground/90 line-clamp-3">
            {profile.bio}
          </p>
        </motion.div>
      )}

      {/* Compétences */}
      {profile.skills && profile.skills.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-auto"
        >
          <h3 className="text-sm font-medium mb-2 text-foreground/80">Compétences</h3>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
            {profile.skills.slice(0, 8).map((skill, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge 
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/20 text-primary border-none transition-colors duration-300"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
            {profile.skills.length > 8 && (
              <Badge variant="outline" className="bg-background/40">
                +{profile.skills.length - 8}
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Actions en bas de la carte */}
      <div className="mt-4 pt-4 border-t border-border/30">
        {!canViewFullProfile && (
          <div className="mb-3 p-2 text-sm text-amber-600 bg-amber-500/10 rounded-md border border-amber-500/20">
            <p>Profil privé</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          {onRequestChat && (
            <Button 
              onClick={onRequestChat}
              variant="secondary"
              className="w-full transition-all duration-300"
              size="sm"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          )}
          
          {onViewProfile && (
            <Button
              onClick={onViewProfile}
              variant="outline"
              className="w-full transition-all duration-300"
              size="sm"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Profil
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
