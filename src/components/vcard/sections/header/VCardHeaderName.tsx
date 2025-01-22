import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";
import { useVCardStyle } from "../../VCardStyleContext";

interface VCardHeaderNameProps {
  profile: UserProfile;
  isEditing: boolean;
  onProfileChange: (updates: Partial<UserProfile>) => void;
}

export function VCardHeaderName({ profile, isEditing, onProfileChange }: VCardHeaderNameProps) {
  const { selectedStyle } = useVCardStyle();

  if (isEditing) {
    return (
      <div className="space-y-4 w-full max-w-md mx-auto sm:mx-0">
        <Input
          value={profile.full_name || ""}
          onChange={(e) => onProfileChange({ full_name: e.target.value })}
          placeholder="Votre nom"
          className="text-xl font-semibold bg-white/10 border-white/20 placeholder:text-white/50"
          style={{ 
            fontFamily: profile.custom_font || selectedStyle.font,
            color: profile.custom_text_color || selectedStyle.colors.text.primary
          }}
        />
        <Input
          value={profile.role || ""}
          onChange={(e) => onProfileChange({ role: e.target.value })}
          placeholder="Votre rôle"
          className="text-sm bg-white/10 border-white/20 placeholder:text-white/50"
          style={{ 
            fontFamily: profile.custom_font || selectedStyle.font,
            color: profile.custom_text_color || selectedStyle.colors.text.secondary
          }}
        />
      </div>
    );
  }

  return (
    <>
      <h2 
        className="text-xl sm:text-2xl font-semibold truncate transition-colors"
        style={{ 
          color: profile.custom_text_color || selectedStyle.colors.text.primary,
          fontFamily: profile.custom_font || selectedStyle.font,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {profile.full_name || "Nom non défini"}
      </h2>
      <p 
        className="text-sm sm:text-base transition-colors"
        style={{ 
          color: profile.custom_text_color || selectedStyle.colors.text.secondary,
          fontFamily: profile.custom_font || selectedStyle.font,
          textShadow: '0 1px 1px rgba(0,0,0,0.05)'
        }}
      >
        {profile.role || "Rôle non défini"}
      </p>
    </>
  );
}