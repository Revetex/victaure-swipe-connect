import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";
import { skillCategories } from "@/data/skills";
import { CategoryIcon } from "./CategoryIcon";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function TouchFriendlySkillSelector({ onSkillSelect, existingSkills }: TouchFriendlySkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = Object.entries(skillCategories).filter(([category]) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 bg-background hover:bg-accent">
          <Plus className="h-4 w-4" />
          Ajouter une compétence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Sélectionner une compétence</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh] px-4 pb-4">
          <div className="space-y-4">
            <AnimatePresence>
              {filteredCategories.map(([category, skills]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-accent"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <CategoryIcon category={category} />
                    <span className="font-medium">{category}</span>
                  </Button>
                  
                  <AnimatePresence>
                    {selectedCategory === category && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-2 pl-8"
                      >
                        {skills.map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            size="sm"
                            className={`text-sm justify-start ${
                              existingSkills.includes(skill) 
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-primary hover:text-primary-foreground'
                            }`}
                            onClick={() => onSkillSelect(skill)}
                            disabled={existingSkills.includes(skill)}
                          >
                            {skill}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}