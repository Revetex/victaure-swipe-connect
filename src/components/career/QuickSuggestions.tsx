import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Brain, DollarSign, Award, BookOpen } from "lucide-react";
import { QuickSuggestionsProps } from "./types";

const QUICK_SUGGESTIONS = [
  {
    text: "Comment améliorer mon CV ?",
    icon: Briefcase,
    color: "text-blue-500"
  },
  {
    text: "Quelles formations me correspondent ?",
    icon: GraduationCap,
    color: "text-green-500"
  },
  {
    text: "Compétences recherchées dans mon domaine",
    icon: Brain,
    color: "text-purple-500"
  },
  {
    text: "Conseils pour négocier mon salaire",
    icon: DollarSign,
    color: "text-yellow-500"
  },
  {
    text: "Comment réussir mes entretiens ?",
    icon: Award,
    color: "text-pink-500"
  },
  {
    text: "Parcours de formation recommandé",
    icon: BookOpen,
    color: "text-indigo-500"
  }
];

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
    >
      {QUICK_SUGGESTIONS.map(({ text, icon: Icon, color }) => (
        <Button
          key={text}
          variant="outline"
          className="flex items-center gap-2 text-sm text-gray-300 border-gray-700 hover:bg-gray-800/50 h-auto py-3"
          onClick={() => onSelect(text)}
        >
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-left">{text}</span>
        </Button>
      ))}
    </motion.div>
  );
}