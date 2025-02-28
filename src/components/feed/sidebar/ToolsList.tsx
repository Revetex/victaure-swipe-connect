
import { Button } from "@/components/ui/button";
import { PenTool, Calculator, Globe, Check, StickyNote } from "lucide-react";
import { motion } from "framer-motion";

export interface ToolsListProps {
  onToolClick: (toolId: string) => void;
}

export const tools = [
  {
    id: "notes",
    name: "Notes",
    icon: <StickyNote className="h-4 w-4" />,
    color: "text-amber-500"
  },
  {
    id: "translator",
    name: "Traducteur",
    icon: <Globe className="h-4 w-4" />,
    color: "text-blue-500"
  },
  {
    id: "calculator",
    name: "Calculatrice",
    icon: <Calculator className="h-4 w-4" />,
    color: "text-purple-500"
  },
  {
    id: "chess",
    name: "Échecs",
    icon: <Check className="h-4 w-4" />, // Remplacement de ChessRook par Check
    color: "text-green-500"
  },
  {
    id: "draw",
    name: "Dessiner",
    icon: <PenTool className="h-4 w-4" />,
    color: "text-red-500"
  }
];

export function ToolsList({ onToolClick }: ToolsListProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 pl-2">
        Outils
      </h2>
      <div className="space-y-px">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal"
              onClick={() => onToolClick(tool.id)}
            >
              <span className={`mr-2 ${tool.color}`}>{tool.icon}</span>
              <span>{tool.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
