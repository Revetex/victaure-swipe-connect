import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { motion, AnimatePresence } from "framer-motion";

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
      icon={<Briefcase className="h-5 w-5" />}
    >
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {(profile.experiences || []).map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 rounded-lg border transition-all duration-300 hover:shadow-md"
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
                    value={experience.position}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "position", e.target.value)
                    }
                    placeholder="Titre du poste"
                    className="w-full p-2 rounded border bg-background/50 backdrop-blur-sm transition-colors focus:ring-2 focus:ring-primary/50"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary,
                      fontFamily: selectedStyle.font
                    }}
                  />
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "company", e.target.value)
                    }
                    placeholder="Entreprise"
                    className="w-full p-2 rounded border bg-background/50 backdrop-blur-sm transition-colors focus:ring-2 focus:ring-primary/50"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary
                    }}
                  />
                  <div className="flex gap-4">
                    <input
                      type="date"
                      value={experience.start_date || ""}
                      onChange={(e) =>
                        handleExperienceChange(experience.id, "start_date", e.target.value)
                      }
                      className="flex-1 p-2 rounded border bg-background/50 backdrop-blur-sm transition-colors focus:ring-2 focus:ring-primary/50"
                      style={{
                        borderColor: `${selectedStyle.colors.primary}30`,
                        color: selectedStyle.colors.text.primary
                      }}
                    />
                    <input
                      type="date"
                      value={experience.end_date || ""}
                      onChange={(e) =>
                        handleExperienceChange(experience.id, "end_date", e.target.value)
                      }
                      className="flex-1 p-2 rounded border bg-background/50 backdrop-blur-sm transition-colors focus:ring-2 focus:ring-primary/50"
                      style={{
                        borderColor: `${selectedStyle.colors.primary}30`,
                        color: selectedStyle.colors.text.primary
                      }}
                    />
                  </div>
                  <textarea
                    value={experience.description || ""}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "description", e.target.value)
                    }
                    placeholder="Description du poste"
                    className="w-full p-2 rounded border min-h-[100px] bg-background/50 backdrop-blur-sm transition-colors focus:ring-2 focus:ring-primary/50"
                    style={{
                      borderColor: `${selectedStyle.colors.primary}30`,
                      color: selectedStyle.colors.text.primary
                    }}
                  />
                  <Button
                    onClick={() => handleRemoveExperience(experience.id)}
                    variant="destructive"
                    className="w-full group"
                  >
                    <Trash2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg" style={{ 
                    color: selectedStyle.colors.text.primary,
                    fontFamily: selectedStyle.font 
                  }}>
                    {experience.position}
                  </h4>
                  <p className="text-base" style={{ 
                    color: selectedStyle.colors.text.primary,
                    fontFamily: selectedStyle.font 
                  }}>
                    {experience.company}
                  </p>
                  <p className="text-sm opacity-75" style={{ 
                    color: selectedStyle.colors.text.muted,
                    fontFamily: selectedStyle.font 
                  }}>
                    {new Date(experience.start_date).toLocaleDateString()} - {experience.end_date ? new Date(experience.end_date).toLocaleDateString() : "Présent"}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ 
                    color: selectedStyle.colors.text.secondary,
                    fontFamily: selectedStyle.font 
                  }}>{experience.description}</p>
                </div>
              )}
            </motion.div>
          ))}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleAddExperience}
                className="group"
                style={{
                  backgroundColor: selectedStyle.colors.primary,
                  color: "white",
                  fontFamily: selectedStyle.font
                }}
              >
                <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Ajouter une expérience
              </Button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </VCardSection>
  );
}