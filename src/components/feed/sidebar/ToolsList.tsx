
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
    gradient: "from-amber-500/20 via-orange-500/20 to-rose-500/20"
  },
  {
    name: "Tâches",
    icon: ListTodo,
    description: "Gérez vos tâches",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20"
  },
  {
    name: "Calculatrice",
    icon: Calculator,
    description: "Calculatrice et convertisseur",
    gradient: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20"
  },
  {
    name: "Traducteur",
    icon: Languages,
    description: "Traduisez du texte",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
  },
  {
    name: "Convertisseur",
    icon: Ruler,
    description: "Convertissez des unités",
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20"
  },
  {
    name: "Échecs",
    icon: Sword,
    description: "Jouez aux échecs",
    gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20"
  }
];

export function ToolsList({ onToolClick }: ToolsListProps) {
  return (
    <>
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.name}
            variant="ghost"
            onClick={() => onToolClick(tool.name)}
            className={cn(
              "h-auto py-2 px-3 flex flex-col items-center justify-center gap-1",
              "bg-gradient-to-br hover:shadow-md transition-all duration-200",
              "group relative w-full",
              tool.gradient
            )}
          >
            <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs font-medium">{tool.name}</span>
          </Button>
        );
      })}
    </>
  );
}

export { tools };
