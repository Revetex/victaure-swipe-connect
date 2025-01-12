import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const { selectedStyle } = useVCardStyle();

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      position: "",
      company: "",
      start_date: "",
      end_date: "",
      description: "",
    };

    setProfile({
      ...profile,
      experiences: [...(profile.experiences || []), newExperience],
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: (profile.experiences || []).filter((exp) => exp.id !== id),
    });
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      experiences: (profile.experiences || []).map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  return (
    <VCardSection 
      title="Expériences professionnelles" 
      icon={<Briefcase className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-4">
        {(profile.experiences || []).map((experience) => (
          <div
            key={experience.id}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: `${selectedStyle.colors.primary}05`,
              borderColor: `${selectedStyle.colors.primary}20`,
              color: selectedStyle.colors.text.primary
            }}
          >
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "position", e.target.value)
                  }
                  placeholder="Titre du poste"
                  className="w-full p-2 rounded border"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary,
                    backgroundColor: `${selectedStyle.colors.primary}05`
                  }}
                />
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "company", e.target.value)
                  }
                  placeholder="Entreprise"
                  className="w-full p-2 rounded border"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary,
                    backgroundColor: `${selectedStyle.colors.primary}05`
                  }}
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={experience.start_date || ""}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "start_date", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary,
                      backgroundColor: `${selectedStyle.colors.primary}05`
                    }}
                  />
                  <input
                    type="date"
                    value={experience.end_date || ""}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "end_date", e.target.value)
                    }
                    className="flex-1 p-2 rounded border"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary,
                      backgroundColor: `${selectedStyle.colors.primary}05`
                    }}
                  />
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "description", e.target.value)
                  }
                  placeholder="Description du poste"
                  className="w-full p-2 rounded border min-h-[100px]"
                  style={{
                    borderColor: `${selectedStyle.colors.primary}30`,
                    color: selectedStyle.colors.text.primary,
                    backgroundColor: `${selectedStyle.colors.primary}05`
                  }}
                />
                <Button
                  onClick={() => handleRemoveExperience(experience.id)}
                  variant="destructive"
                  className="w-full"
                >
                  Supprimer
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="font-semibold" style={{ color: selectedStyle.colors.text.primary }}>
                  {experience.position}
                </h4>
                <p style={{ color: selectedStyle.colors.text.primary }}>
                  {experience.company}
                </p>
                <p className="text-sm" style={{ color: selectedStyle.colors.text.muted }}>
                  {experience.start_date} - {experience.end_date}
                </p>
                <p style={{ color: selectedStyle.colors.text.secondary }}>{experience.description}</p>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button 
            onClick={handleAddExperience}
            className="w-full"
            style={{
              backgroundColor: selectedStyle.colors.primary,
              color: "white"
            }}
          >
            Ajouter une expérience
          </Button>
        )}
      </div>
    </VCardSection>
  );
}