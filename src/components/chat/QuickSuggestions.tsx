
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function QuickSuggestions({ suggestions, onSelect }: QuickSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="border-[#64B5D9]/20 text-[#F1F0FB]/80 hover:bg-[#64B5D9]/10 hover:text-[#F1F0FB]"
          >
            {suggestion}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
