import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const { selectedStyle } = useVCardStyle();

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: "",
    };

    setProfile({
      ...profile,
      education: [...(profile.education || []), newEducation],
    });
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: (profile.education || []).filter((edu) => edu.id !== id),
    });
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      education: (profile.education || []).map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  return (
    <VCardSection 
      title="Formation" 
      icon={<GraduationCap className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {(profile.education || []).map((education) => (
          <div
            key={education.id}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: `${selectedStyle.colors.primary}05`,
              borderColor: `${selectedStyle.colors.primary}20`,
              color: selectedStyle.colors.text.primary,
              fontFamily: selectedStyle.font
            }}
          >
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={education.school_name}
                  onChange={(e) =>
                    handleEducationChange(education.id, "school_name", e.target.value)
                  }
                  placeholder="École"
                  className="w-full p-2 rounded border"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary,
                    fontFamily: selectedStyle.font
                  }}
                />
                <input
                  type="text"
                  value={education.degree}
                  onChange={(e) =>
                    handleEducationChange(education.id, "degree", e.target.value)
                  }
                  placeholder="Diplôme"
                  className="w-full p-2 rounded border"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary
                  }}
                />
                <input
                  type="text"
                  value={education.field_of_study}
                  onChange={(e) =>
                    handleEducationChange(education.id, "field_of_study", e.target.value)
                  }
                  placeholder="Domaine d'études"
                  className="w-full p-2 rounded border"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary
                  }}
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={education.start_date}
                    onChange={(e) =>
                      handleEducationChange(education.id, "start_date", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary
                    }}
                  />
                  <input
                    type="date"
                    value={education.end_date}
                    onChange={(e) =>
                      handleEducationChange(education.id, "end_date", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary
                    }}
                  />
                </div>
                <textarea
                  value={education.description}
                  onChange={(e) =>
                    handleEducationChange(education.id, "description", e.target.value)
                  }
                  placeholder="Description"
                  className="w-full p-2 rounded border min-h-[100px]"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary
                  }}
                />
                <Button
                  onClick={() => handleRemoveEducation(education.id)}
                  variant="destructive"
                  className="w-full"
                >
                  Supprimer
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-semibold" style={{ 
                  color: selectedStyle.colors.text.primary,
                  fontFamily: selectedStyle.font 
                }}>
                  {education.school_name}
                </h4>
                <p style={{ 
                  color: selectedStyle.colors.text.primary,
                  fontFamily: selectedStyle.font 
                }}>{education.degree}</p>
                <p style={{ 
                  color: selectedStyle.colors.text.secondary,
                  fontFamily: selectedStyle.font 
                }}>{education.field_of_study}</p>
                <p className="text-sm" style={{ 
                  color: selectedStyle.colors.text.muted,
                  fontFamily: selectedStyle.font 
                }}>
                  {education.start_date} - {education.end_date}
                </p>
                <p style={{ 
                  color: selectedStyle.colors.text.secondary,
                  fontFamily: selectedStyle.font 
                }}>{education.description}</p>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button 
            onClick={handleAddEducation}
            className="w-full"
            style={{
              backgroundColor: selectedStyle.colors.primary,
              color: "white",
              fontFamily: selectedStyle.font
            }}
          >
            Ajouter une formation
          </Button>
        )}
      </div>
    </VCardSection>
  );
}
