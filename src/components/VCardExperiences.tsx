import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VCardSection } from "../VCardSection";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { UserProfile, Experience } from "@/types/profile";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) return;

    const experience: Experience = {
      id: crypto.randomUUID(),
      company: newExperience.company,
      position: newExperience.position,
      start_date: newExperience.start_date || null,
      end_date: newExperience.end_date || null,
      description: newExperience.description || null
    };

    setProfile({
      ...profile,
      experiences: [...(profile.experiences || []), experience]
    });

    setNewExperience({
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: ""
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences?.filter(exp => exp.id !== id) || []
    });
  };

  return (
    <VCardSection
      title="Expériences professionnelles"
      icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="space-y-6">
        <AnimatePresence>
          {profile.experiences?.map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-white/5 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
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
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExperience(experience.id)}
                    className="text-white/60 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {experience.description && (
                <p className="text-sm text-white/70">{experience.description}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 p-4 rounded-lg bg-white/5"
          >
            <Input
              placeholder="Entreprise"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Input
              placeholder="Poste"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date de début"
                value={newExperience.start_date}
                onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                type="date"
                placeholder="Date de fin"
                value={newExperience.end_date}
                onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Textarea
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              onClick={handleAddExperience}
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200"
              disabled={!newExperience.company || !newExperience.position}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une expérience
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}
