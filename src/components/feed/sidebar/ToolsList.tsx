
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
    gradient: "from-yellow-500/10 to-orange-500/10"
  },
  {
    name: "Tâches",
    icon: ListTodo,
    description: "Gérez vos tâches",
    gradient: "from-blue-500/10 to-indigo-500/10"
  },
  {
    name: "Calculatrice",
    icon: Calculator,
    description: "Calculatrice et convertisseur",
    gradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    name: "Traducteur",
    icon: Languages,
    description: "Traduisez du texte",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    name: "Convertisseur",
    icon: Ruler,
    description: "Convertissez des unités",
    gradient: "from-red-500/10 to-pink-500/10"
  },
  {
    name: "Échecs",
    icon: Sword,
    description: "Jouez aux échecs",
    gradient: "from-slate-500/10 to-gray-500/10"
  }
];

export function ToolsList({ onToolClick }: ToolsListProps) {
  return (
    <div className="space-y-0.5">
      {tools.map((tool) => (
        <Button
          key={tool.name}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2 px-2 h-9",
            "bg-gradient-to-r hover:opacity-80",
            "transition-all duration-300 group",
            tool.gradient
          )}
          onClick={() => onToolClick(tool.name)}
        >
          <tool.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs font-medium">{tool.name}</span>
        </Button>
      ))}
    </div>
  );
}

export { tools };
