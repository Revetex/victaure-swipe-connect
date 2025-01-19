import { Textarea } from "@/components/ui/textarea";
import { VCardSection } from "./VCardSection";
import { FileText } from "lucide-react";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardButton } from "./vcard/VCardButton";

interface VCardBioProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  onGenerateBio?: () => void;
}

export function VCardBio({
  profile,
  isEditing,
  setProfile,
  onGenerateBio
}: VCardBioProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <VCardSection
      title="Bio"
      icon={<FileText className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Écrivez votre bio ici..."
              className="min-h-[150px] resize-none"
              style={{
                backgroundColor: `${selectedStyle.colors.primary}05`,
                borderColor: `${selectedStyle.colors.primary}30`,
                color: selectedStyle.colors.text.primary
              }}
            />
            {onGenerateBio && (
              <VCardButton
                onClick={onGenerateBio}
                variant="outline"
                className="w-auto"
              >
                Générer
              </VCardButton>
            )}
          </div>
        ) : (
          <p 
            className="whitespace-pre-wrap"
            style={{ color: selectedStyle.colors.text.primary }}
          >
            {profile.bio || "Aucune bio définie"}
          </p>
        )}
      </div>
    </VCardSection>
  );
}