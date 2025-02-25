
import { useProfileAccess } from '@/hooks/useProfileAccess';
import { navigationItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationItemProps {
  id: number;
  icon: any;
  name: string;
  route: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface DashboardNavigationProps {
  className?: string;
}

export function DashboardNavigation({ className }: DashboardNavigationProps) {
  const permissions = useProfileAccess();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(0);

  const filteredItems = navigationItems.filter(item => {
    if (permissions.isBusinessProfile) {
      return !['lottery', 'translator'].includes(item.route.replace('/', ''));
    } else {
      return !['jobs/manage', 'analytics'].includes(item.route.replace('/', ''));
    }
  });

  const NavigationItem = ({ id, icon: Icon, name, route, isActive, onClick }: NavigationItemProps) => (
    <button
      onClick={() => {
        setActivePage(id);
        navigate(route);
        onClick?.();
      }}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm rounded-lg w-full",
        "hover:bg-primary/10 transition-colors",
        "text-foreground/80 hover:text-foreground",
        isActive && "bg-primary/10 text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{name}</span>
    </button>
  );

  return (
    <nav className={cn("space-y-1 py-4", className)}>
      {filteredItems.map((item) => (
        <NavigationItem 
          key={item.id} 
          {...item} 
          isActive={activePage === item.id}
        />
      ))}
    </nav>
  );
}
