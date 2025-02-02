import { UserProfile } from "@/types/profile";
import { ColorPicker } from "./ColorPicker";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  const handleCustomizationChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center gap-2">
        <ColorPicker
          label="Police personnalisée"
          value={profile.custom_font || ""}
          onChange={(value) => handleCustomizationChange("custom_font", value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <ColorPicker
          label="Arrière-plan personnalisé"
          value={profile.custom_background || ""}
          onChange={(value) => handleCustomizationChange("custom_background", value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <ColorPicker
          label="Couleur du texte personnalisée"
          value={profile.custom_text_color || ""}
          onChange={(value) => handleCustomizationChange("custom_text_color", value)}
        />
      </div>
    </div>
  );
}