import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Brain, 
  Target,
  Search,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { QuickSuggestionsProps } from "./types";

const suggestions = [
  {
    icon: FileText,
    text: "Améliorer mon CV",
    prompt: "Peux-tu m'aider à améliorer mon CV ?"
  },
  {
    icon: Briefcase,
    text: "Chercher un emploi",
    prompt: "Je cherche un nouvel emploi, peux-tu m'aider ?"
  },
  {
    icon: GraduationCap,
    text: "Formation",
    prompt: "Quelles formations me recommandes-tu pour progresser ?"
  },
  {
    icon: Brain,
    text: "Compétences",
    prompt: "Quelles compétences devrais-je développer ?"
  },
  {
    icon: Target,
    text: "Objectifs",
    prompt: "Aide-moi à définir mes objectifs de carrière"
  },
  {
    icon: Search,
    text: "Analyse marché",
    prompt: "Peux-tu analyser le marché de l'emploi dans mon domaine ?"
  },
  {
    icon: TrendingUp,
    text: "Progression",
    prompt: "Comment puis-je progresser dans ma carrière ?"
  },
  {
    icon: BookOpen,
    text: "Entrevues",
    prompt: "Peux-tu m'aider à me préparer pour les entrevues ?"
  }
];

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
    >
      {suggestions.map(({ icon: Icon, text, prompt }) => (
        <Button
          key={text}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5"
          onClick={() => onSelect(prompt)}
        >
          <Icon className="h-5 w-5 text-primary" />
          <span className="text-sm text-center">{text}</span>
        </Button>
      ))}
    </motion.div>
  );
}