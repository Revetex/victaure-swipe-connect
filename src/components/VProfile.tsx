import { UserProfile } from "@/types/profile";
import { VCard } from "./VCard";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useConnectionStatus } from "./profile/preview/hooks/useConnectionStatus";
import { useConnectionActions } from "./profile/preview/hooks/useConnectionActions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreviewButtons } from "./profile/preview/ProfilePreviewButtons";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Calendar,
  Award,
  Book,
  Building,
  GraduationCap,
  Languages,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  const [showFullBio, setShowFullBio] = useState(false);

  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived
  } = useConnectionStatus(profile.id);

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
    handleRequestCV
  } = useConnectionActions(profile.id);

  const handleEditProfile = () => {
    navigate("/dashboard/profile/edit");
    onClose();
  };

  const canViewFullProfile = isOwnProfile || isFriend || !profile.privacy_enabled;
  const truncatedBio = profile.bio?.substring(0, 150);
  const hasBioOverflow = profile.bio && profile.bio.length > 150;

  const formatExperience = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = format(new Date(startDate), 'MMM yyyy', { locale: fr });
    const end = endDate ? format(new Date(endDate), 'MMM yyyy', { locale: fr }) : "Présent";
    return `${start} - ${end}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Informations détaillées du profil de {profile.full_name || "l'utilisateur"}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="sticky top-0 z-10 p-4 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.img
                src={profile.avatar_url || "/user-icon.svg"}
                alt={profile.full_name || "Avatar"}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div>
                <motion.h2
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xl font-bold"
                >
                  {profile.full_name}
                </motion.h2>
                <motion.div
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  {profile.role && (
                    <Badge variant="secondary" className="capitalize">
                      {profile.role}
                    </Badge>
                  )}
                  {profile.online_status ? (
                    <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">En ligne</Badge>
                  ) : (
                    <Badge variant="secondary">
                      Vu {format(new Date(profile.last_seen || new Date()), 'PPP', { locale: fr })}
                    </Badge>
                  )}
                </motion.div>
              </div>
            </div>
            <ProfilePreviewButtons 
              profile={profile}
              onClose={onClose}
              canViewFullProfile={canViewFullProfile}
              onRequestChat={() => navigate(`/messages?receiver=${profile.id}`)}
              onViewProfile={() => {
                if (isOwnProfile) {
                  handleEditProfile();
                } else {
                  navigate(`/profile/${profile.id}`);
                }
              }}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)] px-6 py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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

              {profile.languages && profile.languages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Langues
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              {profile.experiences && profile.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <h4 className="font-semibold text-lg">{exp.position}</h4>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatExperience(exp.start_date, exp.end_date)}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              {profile.education && profile.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <h4 className="font-semibold text-lg">{edu.degree}</h4>
                  <p className="text-muted-foreground">{edu.school_name}</p>
                  {edu.field_of_study && (
                    <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {formatExperience(edu.start_date, edu.end_date)}
                  </p>
                  {edu.description && (
                    <p className="text-sm mt-2">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6">
              {profile.certifications && profile.certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <h4 className="font-semibold text-lg">{cert.title}</h4>
                  <p className="text-muted-foreground">{cert.institution}</p>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">{cert.year}</p>
                    {cert.credential_url && (
                      <a 
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Voir le certificat
                      </a>
                    )}
                  </div>
                  {cert.description && (
                    <p className="text-sm mt-2">{cert.description}</p>
                  )}
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
