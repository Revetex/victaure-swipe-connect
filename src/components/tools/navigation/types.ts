
import { ComponentType } from "react";

export type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess" | "converter";

export interface ToolInfo {
  id: Tool;
  icon: any;
  label: string;
  description: string;
  component: ComponentType<any>;
  gradient: string;
  comingSoon?: boolean;
}

export interface ToolsNavigationProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  toolsOrder: Tool[];
  onReorderTools?: (newOrder: Tool[]) => void;
  isLoading?: boolean;
}
