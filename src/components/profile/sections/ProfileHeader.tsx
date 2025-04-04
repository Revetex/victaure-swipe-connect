
import { UserProfile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfilePreviewButtons } from "../preview/ProfilePreviewButtons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProfileHeaderProps {
  profile: UserProfile;
  onClose: () => void;
  canViewFullProfile: boolean;
}

export function ProfileHeader({ profile, onClose, canViewFullProfile }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  const handleEditProfile = () => {
    navigate("/dashboard/profile/edit");
    onClose();
  };

  return (
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
  );
}
