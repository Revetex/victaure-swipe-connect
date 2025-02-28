
import { UserProfile } from "@/types/profile";
import { MapPin, Globe, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProfilePreviewContactProps {
  profile: UserProfile;
}

export function ProfilePreviewContact({ profile }: ProfilePreviewContactProps) {
  const contactInfo = [
    profile.city && {
      icon: <MapPin className="w-4 h-4" />,
      text: `${profile.city}${profile.country ? `, ${profile.country}` : ''}`
    },
    profile.website && {
      icon: <Globe className="w-4 h-4" />,
      text: profile.website
    },
    profile.company_name && {
      icon: <Building2 className="w-4 h-4" />,
      text: profile.company_name
    }
  ].filter(Boolean);

  if (!contactInfo.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 space-y-4"
    >
      <h3 className="text-gradient text-lg mb-4">Contact</h3>
      <div className="space-y-4">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-3 group hover-transition hover-float"
          >
            <span className="p-2.5 rounded-xl bg-accent/10 text-primary group-hover:bg-accent/20 hover-transition">
              {info.icon}
            </span>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {info.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
