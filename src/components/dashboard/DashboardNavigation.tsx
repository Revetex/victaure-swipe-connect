import { Home, User, Briefcase, Newspaper, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navItems = [
    { id: 1, icon: User, label: "Profil" },
    { id: 3, icon: Briefcase, label: "Emplois" },
    { id: 4, icon: Newspaper, label: "Actualités" },
    { id: 5, icon: Home, label: "Outils" },
    { id: 6, icon: Settings, label: "Paramètres" },
  ];

  return (
    <nav className="w-full">
      <ul className="flex items-center justify-center max-w-2xl mx-auto gap-2 lg:gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  "hover:text-primary",
                  currentPage === item.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}