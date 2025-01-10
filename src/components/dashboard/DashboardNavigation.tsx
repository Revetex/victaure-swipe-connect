import { UserCircle, MessageSquare, BriefcaseIcon, Settings, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, name: "Profil" },
    { id: 2, icon: MessageSquare, name: "M. Victaure", isPrimary: true },
    { id: 3, icon: BriefcaseIcon, name: "Emplois" },
    { id: 4, icon: ClipboardList, name: "Tâches/Notes" },
    { id: 5, icon: Settings, name: "Paramètres" }
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
          className={`
            relative p-3 rounded-xl transition-all duration-300
            ${currentPage === id
              ? isPrimary 
                ? "bg-red-500/10 dark:bg-red-950/20 text-red-500 dark:text-red-400" 
                : "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
            }
            ${isPrimary ? "scale-110" : ""}
          `}
          aria-label={navigationItems.find(item => item.id === id)?.name}
        >
          <div className={`
            relative rounded-lg
            ${currentPage === id 
              ? isPrimary
                ? "text-red-500 dark:text-red-400"
                : "text-primary dark:text-primary-foreground"
              : "text-muted-foreground"
            }
          `}>
            <Icon className={`
              h-5 w-5 
              ${currentPage === id && isPrimary ? "animate-pulse" : ""}
            `} />
          </div>
          {currentPage === id && (
            <motion.div
              layoutId="activeTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                isPrimary ? "bg-red-500 dark:bg-red-400" : "bg-primary dark:bg-primary-foreground"
              }`}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}