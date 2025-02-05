import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { VCardSection } from "@/components/VCardSection";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile, Experience } from "@/types/profile";
import { ExperienceForm } from "./experiences/ExperienceForm";
import { ExperienceCard } from "./experiences/ExperienceCard";
import { toast } from "sonner";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experiences: [
        ...(profile.experiences || []),
        { 
          id: crypto.randomUUID(), 
          company: "", 
          position: "", 
          start_date: null, 
          end_date: null, 
          description: null,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
    });
    toast.success("Expérience ajoutée");
  };

  const handleUpdateExperience = (updatedExp: Experience) => {
    const newExperiences = [...(profile.experiences || [])];
    const expIndex = newExperiences.findIndex(e => e.id === updatedExp.id);
    newExperiences[expIndex] = updatedExp;
    setProfile({ ...profile, experiences: newExperiences });
  };

  const handleRemoveExperience = (id: string) => {
    const newExperiences = [...(profile.experiences || [])].filter(exp => exp.id !== id);
    setProfile({ ...profile, experiences: newExperiences });
    toast.success("Expérience supprimée");
  };

  const handleReorder = (newOrder: Experience[]) => {
    setProfile({ ...profile, experiences: newOrder });
  };

  return (
    <VCardSection 
      title="Expériences professionnelles"
      icon={<Briefcase className="h-4 w-4" />}
      variant="education"
    >
      <div className="w-full space-y-4">
        {isEditing ? (
          <Reorder.Group axis="y" values={profile.experiences || []} onReorder={handleReorder}>
            {(profile.experiences || []).map((exp: Experience) => (
              <Reorder.Item key={exp.id} value={exp}>
                <motion.div 
                  className="relative w-full bg-card/5 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-border/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ExperienceForm
                    exp={exp}
                    onUpdate={handleUpdateExperience}
                    onRemove={handleRemoveExperience}
                  />
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          (profile.experiences || []).map((exp: Experience) => (
            <motion.div 
              key={exp.id}
              className="relative w-full bg-card/5 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-border/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ExperienceCard exp={exp} />
            </motion.div>
          ))
        )}
        
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={handleAddExperience} 
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200 min-h-[44px]"
            >
              Ajouter une expérience
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}