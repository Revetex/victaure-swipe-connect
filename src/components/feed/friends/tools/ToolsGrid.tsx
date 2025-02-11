
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface Tool {
  name: string;
  icon: any;
  component: any;
  description: string;
  comingSoon?: boolean;
}

interface ToolsGridProps {
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
}

export function ToolsGrid({ tools, onToolClick }: ToolsGridProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"
    )}>
      {tools.map((tool) => (
        <Button
          key={tool.name}
          variant="ghost"
          className={cn(
            "flex flex-col items-center gap-3 p-4 h-auto",
            "hover:bg-accent/5 transition-all duration-200",
            "group relative",
            tool.comingSoon && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => onToolClick(tool)}
          disabled={tool.comingSoon}
        >
          <div className={cn(
            "p-3 rounded-lg transition-all duration-200",
            "group-hover:scale-110"
          )}>
            <tool.icon className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">{tool.name}</p>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              {tool.description}
            </p>
            {tool.comingSoon && (
              <span className="text-xs text-muted-foreground mt-1">
                Bientôt disponible
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
