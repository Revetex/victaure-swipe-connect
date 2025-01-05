import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  const suggestions = [
    "Comment puis-je améliorer mon CV ?",
    "Quelles sont les tendances du marché ?",
    "Conseils pour l'entretien",
    "Développement de carrière"
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-sm whitespace-nowrap"
          >
            {suggestion}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}