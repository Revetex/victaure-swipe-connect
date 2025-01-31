import { Mail, Phone, MapPin } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 sm:p-6 rounded-xl bg-card/10 backdrop-blur-sm border border-border/5"
    >
      <h3 className="text-base sm:text-lg font-semibold text-primary/90">Contact</h3>
      <div className="space-y-2">
        {profile.email && (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-lg bg-card/5 hover:bg-card/10 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <Mail className="h-4 w-4 text-primary/70" />
            <a 
              href={`mailto:${profile.email}`} 
              className="text-sm text-primary/80 hover:text-primary transition-colors"
            >
              {profile.email}
            </a>
          </motion.div>
        )}
        {profile.phone && (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-lg bg-card/5 hover:bg-card/10 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <Phone className="h-4 w-4 text-primary/70" />
            <a 
              href={`tel:${profile.phone}`} 
              className="text-sm text-primary/80 hover:text-primary transition-colors"
            >
              {profile.phone}
            </a>
          </motion.div>
        )}
        {(profile.city || profile.state) && (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-lg bg-card/5 hover:bg-card/10 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <MapPin className="h-4 w-4 text-primary/70" />
            <span className="text-sm text-primary/80">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}