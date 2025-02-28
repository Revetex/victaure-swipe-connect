
import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillsInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function SkillsInput({
  skills,
  onSkillsChange,
  placeholder = "Ajouter une compétence...",
  className,
}: SkillsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      <div
        className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10 cursor-text dark:border-gray-600"
        onClick={focusInput}
      >
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="h-6">
            {skill}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Supprimer {skill}</span>
            </Button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          className="border-0 p-0 flex-1 min-w-[6rem] h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
