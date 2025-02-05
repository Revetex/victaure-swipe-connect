import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface ProfilePreviewContactProps {
  profile: UserProfile;
}

export function ProfilePreviewContact({ profile }: ProfilePreviewContactProps) {
  const hasContactInfo = profile.email || profile.phone || (profile.city && profile.country);
  
  if (!hasContactInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-2"
    >
      <h3 className="text-sm font-medium">Contact</h3>
      <div className="space-y-2">
        {profile.email && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2"
            asChild
          >
            <a href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" />
              <span className="text-sm">{profile.email}</span>
            </a>
          </Button>
        )}
        
        {profile.phone && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2"
            asChild
          >
            <a href={`tel:${profile.phone}`}>
              <Phone className="h-4 w-4" />
              <span className="text-sm">{profile.phone}</span>
            </a>
          </Button>
        )}
        
        {profile.city && profile.country && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {profile.city}, {profile.country}
            </span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}