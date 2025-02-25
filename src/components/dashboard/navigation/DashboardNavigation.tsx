
import { useProfileAccess } from '@/hooks/useProfileAccess';
import { navigationItems } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  id: number;
  icon: any;
  name: string;
  route: string;
}

export function DashboardNavigation() {
  const permissions = useProfileAccess();

  const filteredItems = navigationItems.filter(item => {
    if (permissions.isBusinessProfile) {
      // Filtrer les éléments spécifiques aux entreprises
      return !['lottery', 'translator'].includes(item.route.replace('/', ''));
    } else {
      // Filtrer les éléments spécifiques aux professionnels
      return !['jobs/manage', 'analytics'].includes(item.route.replace('/', ''));
    }
  });

  const NavigationItem = ({ id, icon: Icon, name, route }: NavigationItemProps) => (
    <a
      href={route}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm rounded-lg",
        "hover:bg-primary/10 transition-colors",
        "text-foreground/80 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{name}</span>
    </a>
  );

  return (
    <nav className="space-y-1 py-4">
      {filteredItems.map((item) => (
        <NavigationItem key={item.id} {...item} />
      ))}
    </nav>
  );
}
