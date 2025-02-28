
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
    gradient: "from-amber-500/20 via-orange-500/20 to-rose-500/20",
    shortcut: "⌘N"
  },
  {
    name: "Tâches",
    icon: ListTodo,
    description: "Gérez vos tâches",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    shortcut: "⌘T"
  },
  {
    name: "Calculatrice",
    icon: Calculator,
    description: "Calculatrice et convertisseur",
    gradient: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20",
    shortcut: "⌘C"
  },
  {
    name: "Traducteur",
    icon: Languages,
    description: "Traduisez du texte",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    shortcut: "⌘L"
  },
  {
    name: "Échecs",
    icon: Sword,
    description: "Jouez aux échecs",
    gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20",
    shortcut: "⌘E"
  }
];

export function ToolsList({ onToolClick }: ToolsListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              onClick={() => onToolClick(tool.name)}
              className={cn(
                "w-full h-10 py-1 px-2 flex items-center justify-between gap-2",
                "bg-gradient-to-br hover:shadow-md transition-all duration-200",
                "group relative text-sm",
                tool.gradient
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">{tool.name}</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {tool.shortcut}
              </span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

export { tools };
