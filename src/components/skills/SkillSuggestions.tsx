import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

interface SkillSuggestionsProps {
  searchTerm: string;
  onSelect: (skill: string) => void;
  existingSkills: string[];
}

type Skill = Database["public"]["Tables"]["skills"]["Row"];

export function SkillSuggestions({ searchTerm, onSelect, existingSkills }: SkillSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data: skills, error } = await supabase
          .from('skills')
          .select('name')
          .ilike('name', `${searchTerm}%`)
          .limit(5);

        if (error) throw error;

        if (skills) {
          const filteredSkills = skills
            .map(skill => skill.name)
            .filter(skill => !existingSkills.includes(skill));
          setSuggestions(filteredSkills);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [searchTerm, existingSkills]);

  if (!searchTerm || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        <ScrollArea className="max-h-48">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <div className="text-sm text-muted-foreground p-2">Chargement...</div>
            ) : (
              suggestions.map((skill) => (
                <Button
                  key={skill}
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => onSelect(skill)}
                >
                  {skill}
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
}