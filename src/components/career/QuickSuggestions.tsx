import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { QuickSuggestionsProps } from "./types";

const QUICK_SUGGESTIONS = [
  "Comment améliorer mon CV ?",
  "Quelles sont les compétences recherchées dans mon domaine ?",
  "Conseils pour l'entretien d'embauche",
  "Comment négocier mon salaire ?"
];

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 gap-2 mb-4"
    >
      {QUICK_SUGGESTIONS.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          className="text-sm text-gray-300 border-gray-700 hover:bg-gray-800/50"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </motion.div>
  );
}