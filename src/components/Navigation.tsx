import { 
  Menu, 
  User, 
  Briefcase, 
  Building2, 
  GraduationCap,
  MessageSquare,
  Settings,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  const isMobile = useIsMobile();
  const location = useLocation();

  const navigationItems = [
    {
      icon: MessageSquare,
      href: "/dashboard",
      label: "M. Victaure",
      ariaLabel: "Accéder au chat"
    },
    {
      icon: User,
      href: "/profile",
      label: "Profil",
      ariaLabel: "Accéder au profil"
    },
    {
      icon: Briefcase,
      href: "/jobs",
      label: "Emplois",
      ariaLabel: "Voir les emplois"
    },
    {
      icon: ClipboardList,
      href: "/todos",
      label: "Tâches/Notes",
      ariaLabel: "Gérer les tâches et notes"
    },
    {
      icon: Settings,
      href: "/settings",
      label: "Paramètre",
      ariaLabel: "Accéder aux paramètres"
    }
  ];

  const mobileNav = (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t">
      <div className="flex justify-around items-center p-2 pb-safe">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center gap-1 min-w-[3rem] py-2"
              aria-label={item.ariaLabel}
            >
              <Icon 
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} 
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );

  const desktopNav = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-4 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
                )}
                aria-label={item.ariaLabel}
              >
                <Icon className="h-5 w-5 shrink-0" />
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return isMobile ? mobileNav : desktopNav;
}