import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkillCategoryProps {
  category: string;
  skills: string[];
  isEditing: boolean;
  searchTerm: string;
  onRemoveSkill: (skill: string) => void;
}

export function SkillCategory({
  category,
  skills,
  isEditing,
  searchTerm,
  onRemoveSkill,
}: SkillCategoryProps) {
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredSkills.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{category}</h3>
      <div className="flex flex-wrap gap-2">
        {filteredSkills.map((skill) => (
          <motion.div
            key={`${category}-${skill}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
              {skill}
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveSkill(skill)}
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}