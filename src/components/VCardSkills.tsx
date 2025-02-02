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
      icon={<Code className="h-4 w-4 text-muted-foreground" />}
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
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Badge 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground transition-colors duration-200"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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