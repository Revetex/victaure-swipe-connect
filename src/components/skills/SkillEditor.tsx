import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "./CategoryIcon";
import { motion } from "framer-motion";

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
  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Select
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger className="w-full sm:w-[200px] bg-card">
          <div className="flex items-center gap-2">
            <CategoryIcon category={selectedCategory} />
            <SelectValue placeholder="Catégorie" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.keys(skillCategories).map((category) => (
            <SelectItem key={category} value={category}>
              <div className="flex items-center gap-2">
                <CategoryIcon category={category} />
                <span>{category}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1">
        <Select
          value={newSkill}
          onValueChange={setNewSkill}
        >
          <SelectTrigger className="w-full bg-card">
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
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={!newSkill}
      >
        Ajouter
      </Button>
    </motion.div>
  );
}