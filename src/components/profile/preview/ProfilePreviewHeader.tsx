
import { UserProfile } from "@/types/profile";
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProfilePreviewHeaderProps {
  profile: UserProfile;
}

export function ProfilePreviewHeader({ profile }: ProfilePreviewHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/5 flex items-center justify-center ring-2 ring-primary/10">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-muted-foreground" />
          )}
          {profile.online_status && (
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">
            {profile.full_name || "Utilisateur"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {profile.role}
          </p>
          {profile.city && (
            <p className="text-sm text-muted-foreground mt-1">
              {[profile.city, profile.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
