
import { UserProfile } from "@/types/profile";
import { Mail, Phone, Globe, MapPin, Building, Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfilePreviewButtons } from "./ProfilePreviewButtons";

export interface ProfilePreviewBackProps {
  profile: UserProfile;
  onFlip: () => void;
  canViewFullProfile: boolean;
}

export function ProfilePreviewBack({ profile, onFlip, canViewFullProfile }: ProfilePreviewBackProps) {
  // Formater la date de création
  const formattedDate = profile.created_at
    ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })
    : '';

  return (
    <div className={cn(
      "absolute inset-0 backface-hidden",
      "flex flex-col p-6 gap-4",
      "bg-gradient-to-br from-card/90 via-card/95 to-card",
      "rounded-lg overflow-hidden",
      "transform rotate-y-180"
    )} style={{ transform: "rotateY(180deg)" }}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-foreground/90">Informations</h3>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onFlip}
          className="h-8 w-8 rounded-full bg-background/30 hover:bg-background/50"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Retourner</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
        {/* Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {canViewFullProfile && profile.email && (
            <div className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground/80">Email</p>
                <a 
                  href={`mailto:${profile.email}`}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          )}

          {canViewFullProfile && profile.phone && (
            <div className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground/80">Téléphone</p>
                <a 
                  href={`tel:${profile.phone}`}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {profile.phone}
                </a>
              </div>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground/80">Site web</p>
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors truncate block"
                >
                  {profile.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </div>
            </div>
          )}

          {profile.city && (
            <div className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground/80">Localisation</p>
                <p className="text-sm text-foreground">
                  {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          )}

          {profile.company_name && (
            <div className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground/80">Entreprise</p>
                <p className="text-sm text-foreground">{profile.company_name}</p>
              </div>
            </div>
          )}

          {formattedDate && (
            <div className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground/80">Membre depuis</p>
                <p className="text-sm text-foreground">{formattedDate}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Actions en bas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 pt-3 border-t border-border/30"
      >
        <ProfilePreviewButtons
          profileId={profile.id}
          onMessage={() => {}}
          showMessageButton={false}
        />
      </motion.div>
    </div>
  );
}
