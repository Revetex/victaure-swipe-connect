import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { predefinedSkills } from "@/data/skills";
import { VCardSection } from "./VCardSection";
import { VCardBadge } from "./VCardBadge";
import { Sparkles, Code, Briefcase, Wrench, PaintBucket, Brain } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const skillCategories = {
  "Développement": ["JavaScript", "TypeScript", "Python", "React", "Node.js"],
  "DevOps": ["Docker", "Kubernetes", "AWS", "CI/CD", "Git"],
  "Design": ["UI Design", "UX Research", "Figma", "Adobe XD"],
  "Gestion": ["Agile", "Scrum", "Leadership", "Communication"],
  "Construction": ["Maçonnerie", "Charpente", "Plomberie", "Électricité"],
  "Manuel": ["Peinture", "Carrelage", "Menuiserie", "Serrurerie"]
};

const categoryIcons: Record<string, any> = {
  "Développement": Code,
  "DevOps": Wrench,
  "Design": PaintBucket,
  "Gestion": Briefcase,
  "Construction": Wrench,
  "Manuel": Brain
};

interface VCardSkillsProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
}: VCardSkillsProps) {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string>("Développement");

  const filteredSkills = predefinedSkills.filter(
    skill => !profile.skills.includes(skill) &&
    (skillCategories[selectedCategory]?.includes(skill) || !selectedCategory)
  );

  const groupedSkills = profile.skills.reduce((acc: Record<string, string[]>, skill: string) => {
    const category = Object.entries(skillCategories).find(([_, skills]) => 
      skills.includes(skill)
    )?.[0] || "Autre";
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <VCardSection 
      title="Compétences" 
      icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
      className="space-y-3"
    >
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {categoryIcons[category] && (
              <categoryIcons[category] className="h-4 w-4" />
            )}
            <span>{category}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string) => (
              <VCardBadge
                key={skill}
                text={skill}
                isEditing={isEditing}
                onRemove={() => handleRemoveSkill(skill)}
              />
            ))}
          </div>
        </div>
      ))}

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
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
          <Select
            value={newSkill}
            onValueChange={setNewSkill}
            className="flex-1"
          >
            <SelectTrigger>
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
          <Button 
            onClick={handleAddSkill} 
            variant="secondary"
            className={isMobile ? "w-full" : ""}
          >
            Ajouter
          </Button>
        </div>
      )}
    </VCardSection>
  );
}