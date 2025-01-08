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
      {navigationItems.map(({ id, icon: Icon, name, isPrimary }) => (
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
            relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg 
            transition-all duration-300 min-w-[4.5rem] sm:min-w-[5rem]
            ${currentPage === id
              ? isPrimary 
                ? "text-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg shadow-red-500/20" 
                : "text-primary bg-primary/10 shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }
            ${isPrimary ? "order-first sm:order-none" : ""}
            ${isPrimary ? "scale-110" : ""}
          `}
        >
          <div className={`
            relative p-2 rounded-full 
            ${currentPage === id 
              ? isPrimary
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-primary/20"
              : "bg-muted"
            }
          `}>
            <Icon className={`
              h-5 w-5 
              ${currentPage === id && isPrimary ? "animate-pulse" : ""}
            `} />
          </div>
          <span className="text-xs font-medium whitespace-nowrap">{name}</span>
          {currentPage === id && (
            <motion.div
              layoutId="activeTab"
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                isPrimary ? "bg-red-500" : "bg-primary"
              }`}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}