
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
  className?: string;
}

export function DashboardNavigation({ 
  currentPage, 
  onPageChange,
  isEditing,
  className 
}: DashboardNavigationProps) {
  if (isEditing) return null;

  return (
    <div className={cn("flex items-center justify-around w-full max-w-2xl mx-auto", className)}>
      {navigationItems.map(({ id, icon: Icon, name }) => (
        <motion.button
          key={id}
          onClick={() => onPageChange(id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: id * 0.1 }}
          className={cn(
            "p-3 rounded-xl transition-all duration-300",
            "hover:bg-primary/10 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "touch-manipulation min-h-[44px] min-w-[44px]",
            currentPage === id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-primary"
          )}
          title={name}
          aria-label={name}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">{name}</span>
        </motion.button>
      ))}
    </div>
  );
}
