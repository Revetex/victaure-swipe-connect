import { motion } from "framer-motion";
import { SkillCategory } from "./SkillCategory";
import { SkillEditor } from "./SkillEditor";
import { skillCategories } from "@/data/skills";
import { useState } from "react";

interface CategorizedSkillsProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
}

export function CategorizedSkills({
  profile,
  isEditing,
  setProfile,
  newSkill,
  setNewSkill,
  onAddSkill,
  onRemoveSkill,
}: CategorizedSkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(skillCategories)[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Group skills by category
  const groupedSkills: Record<string, string[]> = {};
  profile.skills?.forEach((skill: string) => {
    let foundCategory = Object.entries(skillCategories).find(([_, skills]) =>
      skills.includes(skill)
    )?.[0];
    
    if (!foundCategory) foundCategory = "Autres";
    
    if (!groupedSkills[foundCategory]) {
      groupedSkills[foundCategory] = [];
    }
    groupedSkills[foundCategory].push(skill);
  });

  const filteredSkills = skillCategories[selectedCategory] || [];

  return (
    <div className="space-y-6">
      {isEditing && (
        <SkillEditor
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={onAddSkill}
          skillCategories={skillCategories}
          filteredSkills={filteredSkills}
        />
      )}

      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Object.entries(groupedSkills).map(([category, skills]) => {
          const filteredCategorySkills = skills.filter((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (filteredCategorySkills.length === 0) return null;
          
          return (
            <SkillCategory
              key={category}
              category={category}
              skills={filteredCategorySkills}
              isEditing={isEditing}
              onRemoveSkill={onRemoveSkill}
            />
          );
        })}
      </motion.div>
    </div>
  );
}