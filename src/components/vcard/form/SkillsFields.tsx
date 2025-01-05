import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { skillCategories } from "@/data/skills";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CategoryIcon } from "@/components/skills/CategoryIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillsFieldsProps {
  form: UseFormReturn<any>;
}

export function SkillsFields({ form }: SkillsFieldsProps) {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(skillCategories)[0]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !form.getValues("skills")?.includes(newSkill)) {
      const currentSkills = form.getValues("skills") || [];
      form.setValue("skills", [...currentSkills, newSkill]);
      setNewSkill("");
    }
  };

  return (
    <FormField
      control={form.control}
      name="skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Compétences</FormLabel>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
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
                    {(skillCategories[selectedCategory] || []).map((skill) => (
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
            </div>

            {field.value && field.value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {field.value.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newSkills = field.value.filter((s: string) => s !== skill);
                        form.setValue("skills", newSkills);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
