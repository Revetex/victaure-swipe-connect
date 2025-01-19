import { VCardSection } from "./VCardSection";
import { GraduationCap } from "lucide-react";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardButton } from "./vcard/VCardButton";

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface VCardEducationProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardEducation({
  profile,
  isEditing,
  setProfile,
}: VCardEducationProps) {
  const { selectedStyle } = useVCardStyle();

  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...(profile.education || []),
        { degree: "", institution: "", year: "" },
      ],
    });
  };

  return (
    <VCardSection 
      title="Formation"
      icon={<GraduationCap className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-4">
        {(profile.education || []).map((edu: Education, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <p className="font-medium">{edu.degree || "Titre non défini"}</p>
            <p>{edu.institution || "Institution non définie"}</p>
            <p>{edu.year || "Année non définie"}</p>
          </div>
        ))}
      </div>
      
      {isEditing && (
        <VCardButton
          onClick={handleAddEducation}
          variant="default"
          className="w-full mt-4"
        >
          Ajouter une formation
        </VCardButton>
      )}
    </VCardSection>
  );
}
