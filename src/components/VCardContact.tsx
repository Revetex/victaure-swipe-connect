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
      <h3 className="text-xl font-semibold text-[#9b87f5]">Contact</h3>
      <div className="space-y-3">
        {profile.email && (
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <Mail className="h-5 w-5 text-[#7E69AB]" />
            <a 
              href={`mailto:${profile.email}`} 
              className="text-[#9b87f5] hover:text-[#b4a4f7] transition-colors"
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
            <Phone className="h-5 w-5 text-[#7E69AB]" />
            <a 
              href={`tel:${profile.phone}`} 
              className="text-[#9b87f5] hover:text-[#b4a4f7] transition-colors"
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
            <MapPin className="h-5 w-5 text-[#7E69AB]" />
            <span className="text-[#9b87f5]">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}