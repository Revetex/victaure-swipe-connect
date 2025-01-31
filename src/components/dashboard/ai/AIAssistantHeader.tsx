import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantHeaderProps {
  onClose: () => void;
}

export function AIAssistantHeader({ onClose }: AIAssistantHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">Assistant Carrière IA</h3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}