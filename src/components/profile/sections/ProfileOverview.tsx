
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Mail, Phone, Globe, Calendar, Award, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {profile.bio && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
              <Target className="h-5 w-5 text-primary/80" />
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
          </div>
        </Card>
      )}

      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
            <Building className="h-5 w-5 text-primary/80" />
            Informations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.city && (
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <MapPin className="h-4 w-4" />
                <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {profile.company_name && (
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Building className="h-4 w-4" />
                <span>{profile.company_name}</span>
              </div>
            )}
            {canViewFullProfile && profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${profile.email}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {profile.email}
                </a>
              </div>
            )}
            {canViewFullProfile && profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${profile.phone}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {profile.phone}
                </a>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {profile.website}
                </a>
              </div>
            )}
            {profile.created_at && (
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Membre depuis {format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {profile.skills && profile.skills.length > 0 && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
              <Award className="h-5 w-5 text-primary/80" />
              Compétences
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
