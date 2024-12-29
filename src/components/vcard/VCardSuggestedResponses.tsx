import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SuggestedResponse {
  text: string;
  type: "formal" | "casual" | "professional";
}

const generateSuggestions = (input: string): SuggestedResponse[] => {
  if (!input || input.length < 3) return [];

  // Basic suggestion logic - this could be enhanced with AI later
  const suggestions: SuggestedResponse[] = [
    {
      text: `${input} - Professional version`,
      type: "professional"
    },
    {
      text: `${input} - Formal response`,
      type: "formal"
    },
    {
      text: `${input} - Casual tone`,
      type: "casual"
    }
  ];

  return suggestions;
};

interface VCardSuggestedResponsesProps {
  inputText: string;
  onSelectSuggestion: (text: string) => void;
}

export function VCardSuggestedResponses({
  inputText,
  onSelectSuggestion
}: VCardSuggestedResponsesProps) {
  const [suggestions, setSuggestions] = useState<SuggestedResponse[]>([]);

  useEffect(() => {
    const newSuggestions = generateSuggestions(inputText);
    setSuggestions(newSuggestions);
  }, [inputText]);

  if (!suggestions.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-2 mt-2"
      >
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start hover:bg-primary/5"
              onClick={() => onSelectSuggestion(suggestion.text)}
            >
              <span className="truncate">{suggestion.text}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {suggestion.type}
              </span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}