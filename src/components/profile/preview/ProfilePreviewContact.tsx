
import { UserProfile } from "@/types/profile";
import { MapPin, Globe, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 bg-card/50 backdrop-blur-sm mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground/90">Contact</h3>
        <div className="space-y-3">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <span className="p-2 rounded-full bg-primary/10 text-primary">
                {info.icon}
              </span>
              <span>{info.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
}
