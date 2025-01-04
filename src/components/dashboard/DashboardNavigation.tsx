import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Settings,
  MessageSquare,
  ListTodo,
  StickyNote
} from "lucide-react";

const navigation = [
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    name: "Tâches",
    href: "/dashboard/todos",
    icon: ListTodo,
  },
  {
    name: "Notes",
    href: "/dashboard/notes",
    icon: StickyNote,
  },
  {
    name: "Paiements",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    name: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNavigation() {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-accent/50",
              "focus:bg-accent",
              "dark:hover:bg-accent/50",
              isActive ? "bg-accent" : "transparent"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}