
import { motion } from "framer-motion";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tool, ToolsNavigationProps } from "./types";
import { tools } from "./toolsConfig";
import { ToolGridItem } from "./ToolGridItem";
import { ToolDialog } from "./ToolDialog";

export function ToolsNavigation({ 
  activeTool, 
  onToolChange, 
  toolsOrder,
  onReorderTools,
  isLoading 
}: ToolsNavigationProps) {
  const [openTool, setOpenTool] = useState<Tool | null>(null);
  const isMobile = useIsMobile();

  const orderedTools = toolsOrder
    .map(toolId => tools.find(t => t.id === toolId))
    .filter(Boolean) as typeof tools;

  const handleToolClick = (toolId: Tool) => {
    if (isLoading) return;
    setOpenTool(toolId);
    onToolChange(toolId);
  };

  const handleClose = () => {
    setOpenTool(null);
  };

  const activeTool_ = tools.find(tool => tool.id === openTool);

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
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid gap-4",
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

      <ToolDialog
        openTool={openTool}
        onClose={handleClose}
        activeTool={activeTool_}
      />
    </>
  );
}
