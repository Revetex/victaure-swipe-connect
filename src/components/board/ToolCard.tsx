import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  onClick: () => void;
}

export function ToolCard({ name, icon: Icon, description, color, onClick }: ToolCardProps) {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:border-primary/20",
        "active:scale-95"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl",
          color
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold tracking-tight">{name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}