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
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={profile.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Votre email"
                  className="h-8"
                />
              ) : (
                <span className="text-sm">{profile.email}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={profile.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Votre téléphone"
                  className="h-8"
                />
              ) : (
                <span className="text-sm">{profile.phone}</span>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Les informations de contact sont privées
          </p>
        )}

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
              <Input
                value={profile.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Ville"
                className="h-8"
              />
              <Input
                value={profile.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Province"
                className="h-8"
              />
              <Input
                value={profile.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Pays"
                className="h-8"
              />
            </div>
          ) : (
            <span className="text-sm">
              {[profile.city, profile.state, profile.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          )}
        </div>

        {shouldShowPrivateInfo && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {isEditing ? (
              <Input
                value={profile.website || ""}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="Votre site web"
                className="h-8"
              />
            ) : profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {profile.website}
              </a>
            ) : null}
          </div>
        )}
      </motion.div>
    </VCardSection>
  );
}