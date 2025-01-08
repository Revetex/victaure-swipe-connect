import { Home, BriefcaseIcon, MessageSquare, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const items = [
    { icon: Home, label: "Accueil" },
    { icon: BriefcaseIcon, label: "Emplois" },
    { icon: MessageSquare, label: "M. Victaure", highlight: true },
    { icon: Settings, label: "Paramètres" }
  ];

  return (
    <nav className="w-full">
      <ul className="flex justify-around items-center w-full">
        {items.map((item, index) => {
          const isActive = currentPage === index;
          const Icon = item.icon;
          
          return (
            <li key={index} className="relative">
              <button
                onClick={() => onPageChange(index)}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                  item.highlight && "text-red-500 hover:text-red-600"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={cn(
                      "absolute -bottom-[1.15rem] w-1 h-1 rounded-full",
                      item.highlight ? "bg-red-500" : "bg-primary"
                    )}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}