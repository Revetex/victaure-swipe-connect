
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { Menu, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [showHidden, setShowHidden] = useState(false);

  if (isEditing) return null;

  const visibleItems = navigationItems.filter(item => !item.hidden || showHidden);

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "w-16 h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1",
                  "hover:bg-primary/10 active:scale-95",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "touch-manipulation"
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">Menu</span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center"
              className="w-48 bg-background/95 backdrop-blur-sm border border-border/50"
            >
              <DropdownMenuItem 
                onClick={() => setShowHidden(!showHidden)}
                className="flex items-center justify-between"
              >
                {showHidden ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    <span>Masquer les éléments</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    <span>Afficher tout</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {visibleItems.map(({ id, icon: Icon, name }) => (
            <motion.button
              key={id}
              onClick={() => onPageChange(id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: id * 0.1 }}
              className={cn(
                "w-16 h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1",
                "hover:bg-primary/10 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "touch-manipulation",
                currentPage === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              )}
              title={name}
              aria-label={name}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
