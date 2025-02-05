import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { useLocation } from "react-router-dom";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
}

export function DashboardNavigation({ 
  currentPage, 
  onPageChange,
  isEditing 
}: DashboardNavigationProps) {
  const location = useLocation();
  const isInMessages = location.pathname.includes('/messages');
  
  if (isEditing || isInMessages) return null;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 lg:border-none lg:bg-transparent transition-all duration-300"
      style={{ 
        height: '4rem',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center max-w-7xl">
        <div className="flex items-center justify-around w-full max-w-2xl mx-auto">
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
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}