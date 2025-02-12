
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  id: number;
  icon: LucideIcon;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export function NavigationItem({ id, icon: Icon, name, isActive, onClick }: NavigationItemProps) {
  return (
    <Button
      key={id}
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start gap-2 text-sm font-medium h-8",
        "relative group transition-all duration-200",
        "hover:bg-accent",
        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
      )}
      onClick={onClick}
    >
      <Icon className={cn(
        "h-4 w-4 shrink-0",
        "transition-transform duration-200",
        "group-hover:scale-110",
        isActive && "text-primary"
      )} />
      {name}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-0.5 inset-y-1 bg-primary rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </Button>
  );
}
