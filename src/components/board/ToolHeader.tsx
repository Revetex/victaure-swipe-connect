import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ToolHeaderProps {
  title: string;
}

export function ToolHeader({ title }: ToolHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/settings")}
        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Settings2 className="h-5 w-5" />
      </Button>
    </div>
  );
}