import { Home, Briefcase, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navItems = [
    { id: 1, icon: Home, label: "Accueil" },
    { id: 2, icon: Briefcase, label: "Missions" },
    { id: 3, icon: MessageSquare, label: "Messages" }
  ];

  return (
    <nav className="flex items-center justify-around w-full">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onPageChange(id)}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            currentPage === id ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </nav>
  );
}