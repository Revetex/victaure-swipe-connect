
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tool, ToolsNavigationProps } from "./types";
import { tools } from "./toolsConfig";
import { ToolGridItem } from "./ToolGridItem";

export function ToolsNavigation({ 
  activeTool, 
  onToolChange, 
  toolsOrder,
  onReorderTools,
  isLoading 
}: ToolsNavigationProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const orderedTools = toolsOrder
    .map(toolId => tools.find(t => t.id === toolId))
    .filter(Boolean) as typeof tools;

  const handleToolClick = (toolId: Tool) => {
    if (isLoading) return;
    onToolChange(toolId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      )}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full h-28" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid gap-4 w-full px-4",
        isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      )}
    >
      {orderedTools.map((tool) => {
        if (!tool) return null;
        return (
          <ToolGridItem
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={handleToolClick}
          />
        );
      })}
    </motion.div>
  );
}
