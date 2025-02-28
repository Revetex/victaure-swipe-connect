
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Mail, Phone, Globe, Calendar, Target } from "lucide-react";
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
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    })
  };

  return (
    <div className="space-y-6">
      {profile.bio && (
        <motion.div
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/30 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Target className="h-5 w-5 text-primary/80" />
                </div>
                <h3 className="text-lg font-semibold text-foreground/90">À propos</h3>
              </div>
              
              <div className="pl-2 border-l-2 border-primary/20">
                <p className="text-muted-foreground leading-relaxed">
                  {showFullBio ? profile.bio : truncatedBio}
                  {hasBioOverflow && (
                    <Button
                      variant="link"
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="px-2 h-auto text-primary"
                    >
                      {showFullBio ? "Voir moins" : "... Voir plus"}
                    </Button>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/30 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Building className="h-5 w-5 text-primary/80" />
              </div>
              <h3 className="text-lg font-semibold text-foreground/90">Informations</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.city && (
                <div className="flex items-center gap-3 group">
                  <MapPin className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              
              {profile.company_name && (
                <div className="flex items-center gap-3 group">
                  <Building className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {profile.company_name}
                  </span>
                </div>
              )}
              
              {canViewFullProfile && profile.email && (
                <div className="flex items-center gap-3 group">
                  <Mail className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <a 
                    href={`mailto:${profile.email}`} 
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
              
              {canViewFullProfile && profile.phone && (
                <div className="flex items-center gap-3 group">
                  <Phone className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <a 
                    href={`tel:${profile.phone}`} 
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              )}
              
              {profile.website && (
                <div className="flex items-center gap-3 group">
                  <Globe className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground group-hover:text-primary transition-colors truncate"
                  >
                    {profile.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
              
              {profile.created_at && (
                <div className="flex items-center gap-3 group">
                  <Calendar className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    Membre depuis {format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {profile.skills && profile.skills.length > 0 && (
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/30 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground/90">Compétences</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-primary/10 hover:bg-primary/20 text-primary-foreground transition-colors text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
