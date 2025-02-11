import { cn } from "@/lib/utils";

interface ToolsGridProps {
  tools: any[];
  onToolClick: (tool: any) => void;
}

export function ToolsGrid({ tools, onToolClick }: ToolsGridProps) {
  return (
    <div className={cn("w-full p-4 space-y-4")}>
      {/* Search bar removed to avoid duplication */}
    </div>
  );
}
