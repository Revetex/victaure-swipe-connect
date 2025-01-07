import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SkillCategory } from "./SkillCategory";
import { SkillEditor } from "./SkillEditor";
import { skillCategories } from "@/data/skills";
import { UserProfile } from "@/types/profile";
import { TouchFriendlySkillSelector } from "./TouchFriendlySkillSelector";

interface CategorizedSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
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

  // Deduplicate skills and group them by category
  const groupedSkills = useMemo(() => {
    const uniqueSkills = profile.skills ? Array.from(new Set(profile.skills)) : [];
    
    if (profile.skills && profile.skills.length !== uniqueSkills.length) {
      setProfile({
        ...profile,
        skills: uniqueSkills
      });
    }

    const grouped: Record<string, string[]> = {};
    Object.keys(skillCategories).forEach(category => {
      grouped[category] = [];
    });

    uniqueSkills.forEach(skill => {
      let skillCategory = Object.entries(skillCategories).find(([_, skills]) =>
        skills.includes(skill)
      )?.[0];

      if (!skillCategory) {
        skillCategory = "Autres";
      }

      if (!grouped[skillCategory]) {
        grouped[skillCategory] = [];
      }
      
      if (!grouped[skillCategory].includes(skill)) {
        grouped[skillCategory].push(skill);
      }
    });

    return grouped;
  }, [profile.skills, setProfile]);

  const filteredSkills = skillCategories[selectedCategory] || [];

  return (
    <div className="space-y-4">
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

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une compétence..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <SkillCategory
            key={category}
            category={category}
            skills={skills}
            isEditing={isEditing}
            searchTerm={searchTerm}
            onRemoveSkill={onRemoveSkill}
          />
        ))}
      </motion.div>

      {isEditing && (
        <TouchFriendlySkillSelector
          onSkillSelect={(skill) => {
            if (!profile.skills?.includes(skill)) {
              setProfile({
                ...profile,
                skills: [...(profile.skills || []), skill]
              });
            }
          }}
          existingSkills={profile.skills || []}
        />
      )}
    </div>
  );
}