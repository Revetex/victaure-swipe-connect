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
      className="space-y-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm"
    >
      <h3 className="text-xl font-semibold text-purple-100">Contact</h3>
      <div className="space-y-3">
        {profile.email && (
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <Mail className="h-5 w-5 text-purple-400" />
            <a 
              href={`mailto:${profile.email}`} 
              className="text-purple-100 hover:text-purple-200 transition-colors"
            >
              {profile.email}
            </a>
          </motion.div>
        )}
        {profile.phone && (
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <Phone className="h-5 w-5 text-purple-400" />
            <a 
              href={`tel:${profile.phone}`} 
              className="text-purple-100 hover:text-purple-200 transition-colors"
            >
              {profile.phone}
            </a>
          </motion.div>
        )}
        {(profile.city || profile.state) && (
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <MapPin className="h-5 w-5 text-purple-400" />
            <span className="text-purple-100">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}