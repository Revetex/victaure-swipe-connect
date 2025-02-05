import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { Mail, Phone, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ContactField } from "./vcard/contact/ContactField";
import { LocationFields } from "./vcard/contact/LocationFields";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  const shouldShowPrivateInfo = !profile.privacy_enabled || isOwnProfile;

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  // Helper function to check if location fields have content
  const hasLocationInfo = () => {
    return Boolean(profile.city || profile.state || profile.country);
  };

  return (
    <VCardSection
      title="Contact"
      icon={<Mail className="h-3 w-3 text-muted-foreground" />}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative p-6 backdrop-blur-sm rounded-xl overflow-hidden"
      >
        {/* Circuit Pattern Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0"
          >
            {/* Horizontal Lines */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`h-line-${i}`}
                className="absolute h-px bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20"
                style={{ top: `${i * 10}%`, left: 0, right: 0 }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: 1, 
                  opacity: 1,
                  transition: { 
                    delay: i * 0.1,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />
            ))}
            
            {/* Circuit Nodes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`node-${i}`}
                className="absolute w-2 h-2 rounded-full bg-purple-500/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.2
                  }
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Contact Information */}
        <div className="relative z-10 space-y-4">
          {shouldShowPrivateInfo && (
            <>
              {(isEditing || profile.email) && (
                <ContactField
                  icon={<Mail className="h-4 w-4" />}
                  value={profile.email}
                  onChange={(value) => handleInputChange("email", value)}
                  isEditing={isEditing}
                  placeholder="Votre email"
                  delay={0.1}
                />
              )}

              {(isEditing || profile.phone) && (
                <ContactField
                  icon={<Phone className="h-4 w-4" />}
                  value={profile.phone}
                  onChange={(value) => handleInputChange("phone", value)}
                  isEditing={isEditing}
                  placeholder="Votre téléphone"
                  delay={0.2}
                />
              )}
            </>
          )}

          {(isEditing || hasLocationInfo()) && (
            <LocationFields
              city={profile.city}
              state={profile.state}
              country={profile.country}
              isEditing={isEditing}
              onChange={handleInputChange}
            />
          )}

          {shouldShowPrivateInfo && profile.website && (
            <ContactField
              icon={<Globe className="h-4 w-4" />}
              value={profile.website}
              onChange={(value) => handleInputChange("website", value)}
              isEditing={isEditing}
              placeholder="Votre site web"
              delay={0.4}
              href={profile.website}
            />
          )}
        </div>
      </motion.div>
    </VCardSection>
  );
}