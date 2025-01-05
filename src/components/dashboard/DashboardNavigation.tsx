import { UserCircle, MessageSquare, BriefcaseIcon, Settings, ClipboardList, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, name: "Profil" },
    { id: 2, icon: MessageSquare, name: "M. Victaure" },
    { id: 3, icon: BriefcaseIcon, name: "Emplois" },
    { id: 4, icon: ClipboardList, name: "Tâches/Notes" },
    { id: 5, icon: Settings, name: "Paramètres" },
    { id: 6, icon: Eye, name: "Voir les offres" }
  ];

  return (
    <div className="w-full flex justify-between items-center px-4">
      {navigationItems.map(({ id, icon: Icon, name }) => (
        <motion.button
          key={id}
          onClick={() => onPageChange(id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: id * 0.1 }}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentPage === id 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs font-medium">{name}</span>
        </motion.button>
      ))}
    </div>
  );
}