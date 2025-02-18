
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
import { MapPin, Briefcase, Mail, Phone, Globe, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

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
                    <Badge variant="success" className="bg-green-500">En ligne</Badge>
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
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Bio Section */}
                {profile.bio && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-lg font-semibold">À propos</h3>
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

                {/* Informations Section */}
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
                      <Briefcase className="h-4 w-4" />
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

                {/* Skills Section */}
                {profile.skills && profile.skills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h3 className="text-lg font-semibold">Compétences</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Friends Section */}
                {profile.friends && profile.friends.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h3 className="text-lg font-semibold">Connexions ({profile.friends.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {profile.friends.slice(0, 8).map((friend) => (
                        <Button
                          key={friend.id}
                          variant="ghost"
                          className="flex items-center gap-2 h-auto p-2"
                          onClick={() => navigate(`/profile/${friend.id}`)}
                        >
                          <img
                            src={friend.avatar_url || "/user-icon.svg"}
                            alt={friend.full_name || ""}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-left">
                            <p className="text-sm font-medium truncate">{friend.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {friend.online_status ? "En ligne" : "Hors ligne"}
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Complete Profile */}
                <VCard profile={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
