import { VCardSection } from "./VCardSection";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({
  profile,
  isEditing,
  setProfile,
}: VCardExperiencesProps) {
  const handleAddExperience = () => {
    const newExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
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
      experiences: profile.experiences?.filter((exp) => exp.id !== id) || [],
    });
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences?.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || [],
    });
  };

  return (
    <VCardSection
      title="Expériences professionnelles"
      icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="space-y-6">
        {(profile.experiences || []).map((experience) => (
          <div
            key={experience.id}
            className="relative p-4 rounded-lg bg-white/5 space-y-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            {isEditing ? (
              <>
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "company", e.target.value)
                  }
                  placeholder="Nom de l'entreprise"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  value={experience.position}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "position", e.target.value)
                  }
                  placeholder="Poste occupé"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={experience.start_date || ""}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "start_date", e.target.value)
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input
                    type="date"
                    value={experience.end_date || ""}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "end_date", e.target.value)
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    handleExperienceChange(experience.id, "description", e.target.value)
                  }
                  placeholder="Description du poste"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExperience(experience.id)}
                  className="absolute top-2 right-2 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <h4 className="font-medium text-white">{experience.position}</h4>
                <p className="text-sm text-white/80">{experience.company}</p>
                {experience.start_date && (
                  <p className="text-sm text-white/60">
                    {new Date(experience.start_date).toLocaleDateString()} - 
                    {experience.end_date 
                      ? new Date(experience.end_date).toLocaleDateString()
                      : "Présent"}
                  </p>
                )}
                {experience.description && (
                  <p className="text-sm text-white/70">{experience.description}</p>
                )}
              </>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={handleAddExperience}
            variant="outline"
            className="w-full border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-sm"
          >
            Ajouter une expérience
          </Button>
        )}
      </div>
    </VCardSection>
  );
}