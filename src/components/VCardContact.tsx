import { UserProfile } from "@/types/profile";
import { Mail, Phone, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ContactField } from "./vcard/contact/ContactField";
import { LocationFields } from "./vcard/contact/LocationFields";
import { ContactSection } from "./vcard/contact/ContactSection";

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
    <ContactSection>
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

      {(isEditing || profile.website) && (
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
    </ContactSection>
  );
}