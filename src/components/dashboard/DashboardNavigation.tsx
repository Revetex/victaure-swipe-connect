import { UserCircle, MessageSquare, BriefcaseIcon, Settings, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const DashboardNavigation = memo(function DashboardNavigation({ 
  currentPage, 
  onPageChange 
}: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, name: "Profil" },
    { id: 2, icon: MessageSquare, name: "M. Victaure" },
    { id: 3, icon: BriefcaseIcon, name: "Emplois" },
    { id: 4, icon: ClipboardList, name: "Tâches/Notes" },
    { id: 5, icon: Settings, name: "Paramètres" }
  ];

  return (
    <div className="flex items-center justify-around w-full">
      {navigationItems.map(({ id, icon: Icon, name }) => (
        <motion.button
          key={id}
          onClick={() => onPageChange(id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.2,
            delay: id * 0.1,
            ease: [0.4, 0, 0.2, 1]
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
            currentPage === id
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          }`}
          style={{ willChange: 'transform' }}
          title={name}
        >
          <Icon className="h-6 w-6" />
          <span className="sr-only">{name}</span>
        </motion.button>
      ))}
    </div>
  );
});