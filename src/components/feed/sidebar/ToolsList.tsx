
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Sword } from "lucide-react";
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
    name: "Échecs",
    icon: Sword,
    description: "Jouez aux échecs",
    gradient: "from-slate-500/20 via-gray-500/20 to-zinc-500/20"
  }
];

export function ToolsList({ onToolClick }: ToolsListProps) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="w-full"
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full h-16 flex flex-col items-center justify-center gap-1",
              "bg-gradient-to-br transition-all duration-300",
              "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
              "group rounded-xl",
              tool.gradient
            )}
            onClick={() => onToolClick(tool.name)}
            title={tool.description}
          >
            <tool.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs font-medium bg-gradient-to-br from-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {tool.name}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export { tools };
