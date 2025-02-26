
import { UserProfile } from "@/types/profile";
import { UserCircle, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
      <div className="flex items-start gap-4">
        <motion.div 
          className="relative shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm ring-2 ring-white/10">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-white/30" />
              </div>
            )}
          </div>
          {profile.online_status && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full ring-2 ring-[#1A1F2C]" />
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {profile.full_name || "Utilisateur"}
          </h3>
          
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {profile.role && (
              <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/70">
                {profile.role === "professional" ? "Professionnel" : "Entreprise"}
              </Badge>
            )}
            {profile.online_status ? (
              <Badge variant="secondary" className="bg-green-500/20 hover:bg-green-500/30 text-green-400">
                En ligne
              </Badge>
            ) : profile.last_seen && (
              <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/50">
                Vu {format(new Date(profile.last_seen), 'PP', { locale: fr })}
              </Badge>
            )}
          </div>

          <div className="mt-2 space-y-1">
            {profile.company_name && (
              <p className="flex items-center gap-1.5 text-sm text-white/70">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="truncate">{profile.company_name}</span>
              </p>
            )}
            {(profile.city || profile.country) && (
              <p className="flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">
                  {[profile.city, profile.country].filter(Boolean).join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
