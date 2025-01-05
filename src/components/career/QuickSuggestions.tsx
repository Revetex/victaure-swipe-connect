import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Brain, DollarSign, Award, BookOpen } from "lucide-react";
import { QuickSuggestionsProps } from "./types";

const QUICK_SUGGESTIONS = [
  {
    text: "Comment améliorer mon CV ?",
    icon: Briefcase,
    color: "text-blue-500",
    description: "Conseils pour optimiser votre CV"
  },
  {
    text: "Quelles formations me correspondent ?",
    icon: GraduationCap,
    color: "text-green-500",
    description: "Formations adaptées à votre profil"
  },
  {
    text: "Compétences recherchées dans mon domaine",
    icon: Brain,
    color: "text-purple-500",
    description: "Tendances du marché"
  },
  {
    text: "Conseils pour négocier mon salaire",
    icon: DollarSign,
    color: "text-yellow-500",
    description: "Stratégies de négociation"
  },
  {
    text: "Comment réussir mes entretiens ?",
    icon: Award,
    color: "text-pink-500",
    description: "Préparation aux entretiens"
  },
  {
    text: "Parcours de formation recommandé",
    icon: BookOpen,
    color: "text-indigo-500",
    description: "Plan de développement personnalisé"
  }
];

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
    >
      {QUICK_SUGGESTIONS.map(({ text, icon: Icon, color, description }) => (
        <motion.div
          key={text}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group"
        >
          <Button
            variant="outline"
            className="w-full flex flex-col items-start gap-2 p-4 text-sm bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-200 min-h-[100px] relative overflow-hidden"
            onClick={() => onSelect(text)}
          >
            <div className="flex items-center gap-2 w-full">
              <Icon className={`h-5 w-5 ${color} transition-transform group-hover:scale-110`} />
              <span className="font-medium text-left text-gray-200">{text}</span>
            </div>
            <p className="text-xs text-gray-400 text-left">{description}</p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}