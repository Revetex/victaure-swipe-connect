
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Mail, Phone, Globe, Calendar, Award, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfileOverviewProps {
  profile: UserProfile;
  canViewFullProfile: boolean;
  showFullBio: boolean;
  setShowFullBio: (show: boolean) => void;
  truncatedBio: string;
  hasBioOverflow: boolean;
}

export function ProfileOverview({
  profile,
  canViewFullProfile,
  showFullBio,
  setShowFullBio,
  truncatedBio,
  hasBioOverflow
}: ProfileOverviewProps) {
  return (
    <div className="space-y-6">
      {profile.bio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            À propos
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {showFullBio ? profile.bio : truncatedBio}
            {hasBioOverflow && (
              <Button
                variant="link"
                onClick={() => setShowFullBio(!showFullBio)}
                className="px-2 h-auto"
              >
                {showFullBio ? "Voir moins" : "... Voir plus"}
              </Button>
            )}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {profile.city && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}</span>
          </div>
        )}
        {profile.company_name && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{profile.company_name}</span>
          </div>
        )}
        {canViewFullProfile && profile.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${profile.email}`} className="hover:text-primary">{profile.email}</a>
          </div>
        )}
        {canViewFullProfile && profile.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${profile.phone}`} className="hover:text-primary">{profile.phone}</a>
          </div>
        )}
        {profile.website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              {profile.website}
            </a>
          </div>
        )}
        {profile.created_at && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Membre depuis {format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })}</span>
          </div>
        )}
      </motion.div>

      {profile.skills && profile.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Compétences
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
