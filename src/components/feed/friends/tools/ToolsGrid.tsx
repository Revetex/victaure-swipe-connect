import { cn } from "@/lib/utils";

interface ToolsGridProps {
  tools: any[];
  onToolClick: (tool: any) => void;
}

export function ToolsGrid({ tools, onToolClick }: ToolsGridProps) {
  return (
    <div className={cn("w-full p-4 space-y-4")}>
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolClick(tool)}
          className="w-full p-4 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
        >
          {tool.name}
        </button>
      ))}
    </div>
  );
}
