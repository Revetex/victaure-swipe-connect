
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { X, Code, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { StyleOption } from "../types";

interface VCardSkillsSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
  selectedStyle: StyleOption;
}

export function VCardSkillsSection({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
  selectedStyle,
}: VCardSkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");
  const uniqueSkills = profile.skills ? Array.from(new Set(profile.skills)) : [];

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Vérifier si la compétence existe déjà (insensible à la casse)
    const skillExists = uniqueSkills.some(
      skill => skill.toLowerCase() === newSkill.trim().toLowerCase()
    );
    
    if (!skillExists) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()],
      });
    }
    
    setNewSkill("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary/80" />
          <h3 className="font-medium text-foreground/90">Compétences</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <AnimatePresence>
            {uniqueSkills.length > 0 ? (
              uniqueSkills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative group"
                >
                  <Badge 
                    variant="outline"
                    className="px-2.5 py-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
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
          </AnimatePresence>
        </div>
        
        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ajouter une compétence..."
              className="bg-white/5 border-white/10 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddSkill}
              className="h-10 w-10 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
