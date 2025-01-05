import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  const suggestions = [
    "Aide-moi à améliorer mon profil professionnel",
    "Quelles sont les tendances du marché du travail ?",
    "Comment puis-je me démarquer dans ma recherche d'emploi ?",
    "Conseils pour mon développement professionnel",
    "Aide-moi à identifier mes compétences clés",
    "Comment négocier mon salaire ?",
    "Conseils pour l'entretien d'embauche",
    "Comment faire évoluer ma carrière ?"
  ];

  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Suggestions rapides
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full text-left h-auto whitespace-normal py-2"
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}