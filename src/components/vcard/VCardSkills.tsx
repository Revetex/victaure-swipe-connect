import { VCardSection } from "../VCardSection";
import { Brain } from "lucide-react";
import { useState } from "react";
import { SkillList } from "../skills/SkillList";
import { SkillEditor } from "../skills/SkillEditor";
import { skillCategories } from "@/data/skills";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VCardSkillsProps {
  profile: {
    id: string;
    skills: string[];
  };
  isEditing: boolean;
  setProfile: (profile: any) => void;
  newSkill?: string;
  setNewSkill?: (skill: string) => void;
  handleAddSkill?: () => void;
  handleRemoveSkill?: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  newSkill = "",
  setNewSkill = () => {},
  handleAddSkill = () => {},
  handleRemoveSkill = () => {},
}: VCardSkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(skillCategories)[0]);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateSkills = async (skills: string[]) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, skills });
      toast.success("Compétences mises à jour");
    } catch (error) {
      console.error('Error updating skills:', error);
      toast.error("Erreur lors de la mise à jour des compétences");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSkillToDb = async () => {
    if (newSkill && !profile.skills?.includes(newSkill)) {
      const updatedSkills = [...(profile.skills || []), newSkill];
      await updateSkills(updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkillFromDb = async (skillToRemove: string) => {
    const updatedSkills = profile.skills?.filter(
      (skill: string) => skill !== skillToRemove
    );
    await updateSkills(updatedSkills || []);
  };

  const filteredSkills = Object.values(skillCategories)
    .flatMap(categoryGroup => Object.values(categoryGroup))
    .flat()
    .filter(skill => !profile.skills?.includes(skill) &&
      (skillCategories[selectedCategory]?.includes(skill) || !selectedCategory));

  const groupedSkills: Record<string, string[]> = profile.skills?.reduce((acc: Record<string, string[]>, skill: string) => {
    const category = Object.entries(skillCategories).find(([_, skills]) =>
      Object.values(skills).flat().includes(skill)
    )?.[0] || "Autre";
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <VCardSection 
      title="Compétences" 
      icon={<Brain className="h-4 w-4 text-muted-foreground" />}
      className="space-y-3 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900/40 p-6 rounded-lg shadow-sm"
    >
      <SkillList
        groupedSkills={groupedSkills}
        isEditing={isEditing}
        onRemoveSkill={isEditing ? handleRemoveSkillFromDb : undefined}
      />

      {isEditing && (
        <SkillEditor
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={handleAddSkillToDb}
          skillCategories={skillCategories}
          filteredSkills={filteredSkills}
          isLoading={isUpdating}
        />
      )}
    </VCardSection>
  );
}