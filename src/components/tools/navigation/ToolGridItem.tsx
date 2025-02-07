
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tool, ToolInfo } from "./types";

interface ToolGridItemProps {
  tool: ToolInfo;
  isActive: boolean;
  onClick: (tool: Tool) => void;
}

export function ToolGridItem({ tool, isActive, onClick }: ToolGridItemProps) {
  const Icon = tool.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button 
        variant={isActive ? "default" : "outline"}
        onClick={() => onClick(tool.id)}
        className={cn(
          "w-full h-28 flex flex-col items-center justify-center gap-3 p-4",
          "transition-all duration-300",
          "hover:shadow-lg hover:border-primary/20",
          "bg-gradient-to-br",
          tool.gradient,
          isActive && "ring-2 ring-primary/20",
          tool.comingSoon && "opacity-50 cursor-not-allowed"
        )}
        disabled={tool.comingSoon}
        aria-label={tool.description}
        role="tab"
        aria-selected={isActive}
        aria-controls={`${tool.id}-panel`}
      >
        <Icon className={cn(
          "h-6 w-6 transition-transform duration-300",
          "group-hover:scale-110",
          isActive && "text-primary"
        )} />
        <span className="text-sm font-medium text-center line-clamp-2">
          {tool.label}
          {tool.comingSoon && (
            <span className="block text-xs text-muted-foreground">
              Bientôt disponible
            </span>
          )}
        </span>
      </Button>
    </motion.div>
  );
}
