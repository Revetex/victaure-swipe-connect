export interface Skill {
  name: string;
  category: string;
}

export interface SkillEditorProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  skillCategories: Record<string, string[]>;
  filteredSkills: string[];
  isLoading?: boolean;
}

export interface SkillCategoryProps {
  category: string;
  skills: string[];
  isEditing: boolean;
  searchTerm: string;
  onRemoveSkill?: (skill: string) => void;
}

export interface SkillListProps {
  groupedSkills: Record<string, string[]>;
  isEditing: boolean;
  onRemoveSkill?: (skill: string) => void;
}