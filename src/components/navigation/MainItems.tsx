
import { MessageSquare, Users, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const mainItems = [
  { 
    icon: MessageSquare, 
    label: 'Messages', 
    to: '/dashboard/messages'
  },
  {
    icon: Users,
    label: 'Mes Connections',
    to: '/dashboard/connections'
  },
  {
    icon: UserPlus,
    label: 'Demandes en attente',
    to: '/dashboard/requests'
  }
];

export function MainItems() {
  return (
    <div className="space-y-2">
      {mainItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent/50 active:scale-[0.98]"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
