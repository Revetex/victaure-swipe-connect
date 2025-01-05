import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Briefcase, GraduationCap, Brain, Target } from "lucide-react";

const suggestions = [
  {
    text: "Aide-moi à créer mon CV",
    icon: FileText,
    description: "Je vais vous guider pour créer un CV professionnel"
  },
  {
    text: "Quelle orientation professionnelle me conseilles-tu ?",
    icon: Target,
    description: "Analysons ensemble votre profil et vos objectifs"
  },
  {
    text: "Améliore ma bio professionnelle",
    icon: Brain,
    description: "Optimisons votre présentation professionnelle"
  },
  {
    text: "Ajoute une nouvelle expérience",
    icon: Briefcase,
    description: "Détaillons ensemble vos expériences professionnelles"
  },
  {
    text: "Ajoute une formation",
    icon: GraduationCap,
    description: "Enrichissons votre parcours académique"
  }
];

interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
    >
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Button
              variant="ghost"
              className="w-full h-auto p-4 bg-gray-800/50 hover:bg-gray-700/50 text-left flex flex-col gap-2 items-start rounded-xl transition-all duration-200 group-hover:scale-102 group-hover:shadow-lg"
              onClick={() => onSelect(suggestion.text)}
            >
              <div className="flex items-center gap-3 text-gray-200">
                <Icon className="h-5 w-5 text-indigo-400" />
                <span className="font-medium">{suggestion.text}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}