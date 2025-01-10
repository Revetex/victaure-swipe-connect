import { UserCircle, MessageSquare, BriefcaseIcon, Settings, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, isPrimary: false },
    { id: 2, icon: MessageSquare, isPrimary: true },
    { id: 3, icon: BriefcaseIcon, isPrimary: false },
    { id: 4, icon: ClipboardList, isPrimary: false },
    { id: 5, icon: Settings, isPrimary: false }
  ];

  return (
    <div className="flex items-center justify-around w-full">
      {navigationItems.map(({ id, icon: Icon, isPrimary }) => (
        <motion.button
          key={id}
          onClick={() => onPageChange(id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            delay: id * 0.1,
            type: "spring",
            stiffness: 500
          }}
          className={cn(
            "relative p-3 rounded-xl transition-all duration-300",
            currentPage === id && isPrimary 
              ? "bg-primary/10 text-primary" 
              : currentPage === id 
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            isPrimary && "scale-110"
          )}
          aria-label={navigationItems.find(item => item.id === id)?.icon.name}
        >
          <div className={cn(
            "relative rounded-lg",
            currentPage === id 
              ? isPrimary
                ? "text-primary"
                : "text-accent-foreground"
              : "text-muted-foreground"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              currentPage === id && isPrimary && "animate-pulse"
            )} />
          </div>
          {currentPage === id && (
            <motion.div
              layoutId="activeTab"
              className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5",
                isPrimary ? "bg-primary" : "bg-accent-foreground"
              )}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}