import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { Briefcase } from "lucide-react";
import { Button } from "./ui/button";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardExperiences({ profile, isEditing, setProfile, customStyles }: VCardExperiencesProps) {
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
      icon={<Briefcase className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {(profile.experiences || []).map((experience) => (
          <div
            key={experience.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
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
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "company", e.target.value)
                  }
                  placeholder="Entreprise"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={experience.start_date}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "start_date", e.target.value)
                    }
                    className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="date"
                    value={experience.end_date}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "end_date", e.target.value)
                    }
                    className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <textarea
                  value={experience.description}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "description", e.target.value)
                  }
                  placeholder="Description du poste"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 min-h-[100px]"
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
                <h4 className="font-semibold">{experience.position}</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {experience.company}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {experience.start_date} - {experience.end_date || "Présent"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">{experience.description}</p>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button 
            onClick={handleAddExperience}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Ajouter une expérience
          </Button>
        )}
      </div>
    </VCardSection>
  );
}