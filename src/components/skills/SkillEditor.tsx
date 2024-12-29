import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface SkillEditorProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  skillCategories: Record<string, string[]>;
  filteredSkills: string[];
}

export function SkillEditor({
  selectedCategory,
  setSelectedCategory,
  newSkill,
  setNewSkill,
  handleAddSkill,
  skillCategories,
  filteredSkills,
}: SkillEditorProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      <div className="w-full sm:w-[200px]">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(skillCategories).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select
          value={newSkill}
          onValueChange={setNewSkill}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800">
            <SelectValue placeholder="Sélectionnez une compétence" />
          </SelectTrigger>
          <SelectContent>
            {filteredSkills.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={handleAddSkill} 
        variant="secondary"
        className={`${isMobile ? "w-full" : ""} bg-indigo-600 hover:bg-indigo-700 text-white`}
      >
        Ajouter
      </Button>
    </div>
  );
}