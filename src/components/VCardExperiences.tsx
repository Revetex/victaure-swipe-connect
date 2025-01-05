import { VCardSection } from "./VCardSection";
import { Briefcase, X, Building2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
    toast.success("Expérience ajoutée");
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences?.filter((exp) => exp.id !== id) || [],
    });
    toast.success("Expérience supprimée");
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
      icon={<Briefcase className="h-5 w-5 text-indigo-400" />}
    >
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {(profile.experiences || []).map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-white/5 space-y-4 border border-indigo-500/20 hover:border-indigo-500/30 transition-colors"
            >
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                    <Input
                      value={experience.company}
                      onChange={(e) =>
                        handleExperienceChange(experience.id, "company", e.target.value)
                      }
                      placeholder="Nom de l'entreprise"
                      className="bg-white/10 border-indigo-500/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-400 shrink-0" />
                    <Input
                      value={experience.position}
                      onChange={(e) =>
                        handleExperienceChange(experience.id, "position", e.target.value)
                      }
                      placeholder="Poste occupé"
                      className="bg-white/10 border-indigo-500/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-400 shrink-0" />
                      <Input
                        type="date"
                        value={experience.start_date || ""}
                        onChange={(e) =>
                          handleExperienceChange(experience.id, "start_date", e.target.value)
                        }
                        className="bg-white/10 border-indigo-500/20 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-400 shrink-0" />
                      <Input
                        type="date"
                        value={experience.end_date || ""}
                        onChange={(e) =>
                          handleExperienceChange(experience.id, "end_date", e.target.value)
                        }
                        className="bg-white/10 border-indigo-500/20 text-white"
                      />
                    </div>
                  </div>
                  <Textarea
                    value={experience.description || ""}
                    onChange={(e) =>
                      handleExperienceChange(experience.id, "description", e.target.value)
                    }
                    placeholder="Description du poste"
                    className="bg-white/10 border-indigo-500/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExperience(experience.id)}
                    className="absolute top-2 right-2 text-indigo-400 hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                    <h4 className="font-medium text-white">{experience.position}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-400 shrink-0" />
                    <p className="text-white/80">{experience.company}</p>
                  </div>
                  {experience.start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-400 shrink-0" />
                      <p className="text-white/60">
                        {new Date(experience.start_date).toLocaleDateString()} - 
                        {experience.end_date 
                          ? new Date(experience.end_date).toLocaleDateString()
                          : "Présent"}
                      </p>
                    </div>
                  )}
                  {experience.description && (
                    <p className="text-white/70 pl-6">{experience.description}</p>
                  )}
                </>
              )}
            </motion.div>
          ))}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleAddExperience}
                variant="outline"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500"
              >
                Ajouter une expérience
              </Button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </VCardSection>
  );
}