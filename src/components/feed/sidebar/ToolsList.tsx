
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { motion } from "framer-motion";

interface ToolsListProps {
  onToolClick: (toolName: string) => void;
}

const tools = [
  {
    name: "Notes",
    icon: Plus,
    description: "Gérez vos notes",
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    name: "Tâches",
    icon: ListTodo,
    description: "Gérez vos tâches",
    gradient: "from-blue-500/20 to-indigo-500/20"
  },
  {
    name: "Calculatrice",
    icon: Calculator,
    description: "Calculatrice et convertisseur",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    name: "Traducteur",
    icon: Languages,
    description: "Traduisez du texte",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    name: "Convertisseur",
    icon: Ruler,
    description: "Convertissez des unités",
    gradient: "from-red-500/20 to-pink-500/20"
  },
  {
    name: "Échecs",
    icon: Sword,
    description: "Jouez aux échecs",
    gradient: "from-slate-500/20 to-gray-500/20"
  }
];

export function ToolsList({ onToolClick }: ToolsListProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto py-3 flex-col items-center justify-center gap-2",
              "bg-gradient-to-br transition-all duration-300",
              "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
              "group rounded-lg w-full",
              tool.gradient
            )}
            onClick={() => onToolClick(tool.name)}
            title={tool.description}
          >
            <tool.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs font-medium">{tool.name}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export { tools };
