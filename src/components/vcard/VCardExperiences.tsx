import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VCardSection } from "@/components/VCardSection";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile, Experience } from "@/types/profile";
import { useVCardStyle } from "./VCardStyleContext";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const { selectedStyle } = useVCardStyle();
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
      icon={<Briefcase className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-6">
        <AnimatePresence>
          {profile.experiences?.map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-card/50 space-y-2 border border-border/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium" style={{ color: selectedStyle.colors.text.primary }}>
                    {experience.position}
                  </h4>
                  <p className="text-sm" style={{ color: selectedStyle.colors.text.secondary }}>
                    {experience.company}
                  </p>
                  {experience.start_date && (
                    <p className="text-sm" style={{ color: selectedStyle.colors.text.muted }}>
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
                    style={{ color: selectedStyle.colors.primary }}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {experience.description && (
                <p className="text-sm" style={{ color: selectedStyle.colors.text.muted }}>
                  {experience.description}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 p-4 rounded-lg bg-card/50 border border-border/50"
          >
            <Input
              placeholder="Entreprise"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="bg-background/50 border-input"
            />
            <Input
              placeholder="Poste"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="bg-background/50 border-input"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date de début"
                value={newExperience.start_date}
                onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                className="bg-background/50 border-input"
              />
              <Input
                type="date"
                placeholder="Date de fin"
                value={newExperience.end_date}
                onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                className="bg-background/50 border-input"
              />
            </div>
            <Textarea
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              className="bg-background/50 border-input"
            />
            <Button
              onClick={handleAddExperience}
              className="w-full"
              style={{ 
                backgroundColor: selectedStyle.colors.primary,
                color: '#fff'
              }}
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