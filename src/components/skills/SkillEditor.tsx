import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface SkillEditorProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  skillCategories: Record<string, string[]>;
  filteredSkills: string[];
  existingSkills: string[];
}

export function SkillEditor({
  selectedCategory,
  setSelectedCategory,
  newSkill,
  setNewSkill,
  handleAddSkill,
  skillCategories,
  filteredSkills,
  existingSkills,
}: SkillEditorProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
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
      </div>

      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="flex flex-wrap gap-2">
          {filteredSkills.map((skill) => {
            const isSelected = existingSkills.includes(skill);
            return (
              <Badge
                key={skill}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? "bg-primary/10 hover:bg-primary/20" 
                    : "hover:bg-primary/5"
                }`}
                onClick={() => {
                  if (!isSelected) {
                    setNewSkill(skill);
                    handleAddSkill();
                  }
                }}
              >
                {skill}
                {!isSelected && (
                  <Plus className="ml-1 h-3 w-3 text-muted-foreground" />
                )}
              </Badge>
            )}
          )}
        </div>
      </ScrollArea>
    </div>
  );
}