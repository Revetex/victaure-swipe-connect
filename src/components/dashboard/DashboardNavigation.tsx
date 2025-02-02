import { UserCircle, MessageSquare, BriefcaseIcon, Settings, Newspaper, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, name: "Profil" },
    { id: 2, icon: MessageSquare, name: "Messages" },
    { id: 3, icon: BriefcaseIcon, name: "Emplois" },
    { id: 4, icon: Newspaper, name: "Actualités" },
    { id: 5, icon: Wrench, name: "Outils" },
    { id: 6, icon: Settings, name: "Paramètres" }
  ];

  return (
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
  );
}