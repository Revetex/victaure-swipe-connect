
import { VCardSection } from "./VCardSection";
import { Code, X } from "lucide-react";
import { TouchFriendlySkillSelector } from "./skills/TouchFriendlySkillSelector";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

interface VCardSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
}: VCardSkillsProps) {
  const uniqueSkills = profile.skills ? Array.from(new Set(profile.skills)) : [];

  return (
    <VCardSection
      title="Compétences"
      icon={<Code className="h-3 w-3 text-muted-foreground" />}
    >
      <div className="w-full space-y-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 p-4"
        >
          {uniqueSkills.length > 0 ? (
            uniqueSkills.map((skill) => (
              <motion.div
                key={skill}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <Badge 
                  variant="secondary"
                  className="px-2 py-1 text-xs bg-secondary/40 text-secondary-foreground"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1.5"
                      aria-label="Supprimer la compétence"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Aucune compétence ajoutée
            </p>
          )}
        </motion.div>
        
        {isEditing && (
          <div className="w-full px-4">
            <TouchFriendlySkillSelector
              onSkillSelect={(skill) => {
                if (!profile.skills?.includes(skill)) {
                  setProfile({
                    ...profile,
                    skills: [...(profile.skills || []), skill],
                  });
                }
              }}
              existingSkills={uniqueSkills}
            />
          </div>
        )}
      </div>
    </VCardSection>
  );
}
