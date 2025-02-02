import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { VCardSection } from "@/components/VCardSection";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

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

  const renderContactField = (icon: React.ReactNode, value: string | null | undefined, field: string, placeholder: string) => {
    if (!isEditing && !value) return null;

    return (
      <div className="flex items-center gap-2">
        {icon}
        {isEditing ? (
          <Input
            value={value || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            className="h-8"
          />
        ) : (
          <span className="text-sm">{value}</span>
        )}
      </div>
    );
  };

  return (
    <VCardSection
      title="Contact"
      icon={<Mail className="h-3 w-3 text-muted-foreground" />}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 p-4"
      >
        {shouldShowPrivateInfo ? (
          <>
            {renderContactField(
              <Mail className="h-4 w-4 text-muted-foreground" />,
              profile.email,
              "email",
              "Votre email"
            )}
            {renderContactField(
              <Phone className="h-4 w-4 text-muted-foreground" />,
              profile.phone,
              "phone",
              "Votre téléphone"
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Les informations de contact sont privées
          </p>
        )}

        {renderContactField(
          <MapPin className="h-4 w-4 text-muted-foreground" />,
          [profile.city, profile.state, profile.country].filter(Boolean).join(", ") || null,
          "location",
          "Votre localisation"
        )}

        {shouldShowPrivateInfo && renderContactField(
          <Globe className="h-4 w-4 text-muted-foreground" />,
          profile.website,
          "website",
          "Votre site web"
        )}
      </motion.div>
    </VCardSection>
  );
}