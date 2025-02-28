
import { UserProfile } from "@/types/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { MailIcon, PhoneIcon, MapPinIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile: boolean;
  onImageClick?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  onRequestChat,
  canViewFullProfile,
  onImageClick
}: ProfilePreviewDialogProps) {
  // Déterminer quelles infos sont visibles
  const showEmail = canViewFullProfile && profile.email;
  const showPhone = canViewFullProfile && profile.phone;
  const showLocation = canViewFullProfile && (profile.city || profile.state || profile.country);

  return (
    <div className="flex flex-col p-4 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative cursor-pointer" onClick={onImageClick}>
          <UserAvatar 
            user={profile} 
            className="h-16 w-16 border-2 border-background" 
            fallbackClassName="bg-primary/10 text-primary"
          />
          {profile.online_status && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold truncate">{profile.full_name}</h2>
          {profile.role && (
            <p className="text-sm text-muted-foreground">{profile.role}</p>
          )}
        </div>
      </div>

      {profile.bio && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">À propos</h3>
          <p className="text-sm text-muted-foreground">
            {profile.bio.length > 150 
              ? `${profile.bio.substring(0, 150)}...` 
              : profile.bio}
          </p>
        </div>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">Compétences</h3>
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 5 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                +{profile.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-medium mb-1">Contact</h3>
        
        {showEmail && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm"
          >
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span>{profile.email}</span>
          </motion.div>
        )}
        
        {showPhone && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <span>{profile.phone}</span>
          </motion.div>
        )}
        
        {showLocation && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm"
          >
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
            </span>
          </motion.div>
        )}

        {profile.website && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-sm"
          >
            <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          </motion.div>
        )}
        
        {/* Placeholder si aucune information de contact visible */}
        {!showEmail && !showPhone && !showLocation && !profile.website && (
          <p className="text-sm text-muted-foreground italic">
            {canViewFullProfile 
              ? "Aucune information de contact disponible" 
              : "Informations de contact privées"}
          </p>
        )}
      </div>

      {onRequestChat && (
        <Button 
          onClick={onRequestChat}
          className="w-full"
          variant="default"
        >
          Envoyer un message
        </Button>
      )}
    </div>
  );
}
