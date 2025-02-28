
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserRole } from "@/types/profile";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  GraduationCap,
  ShoppingBag,
  Home,
  Globe,
  NotebookPen,
  BriefcaseBusiness,
  CreditCard,
  UserCircle
} from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useProfile } from "@/hooks/useProfile";

type NavigationItem = {
  href: string;
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
  roles?: UserRole[];
};

export function AppHeader() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();

  // Base navigation items
  const navigationItems: NavigationItem[] = [
    {
      href: "/dashboard",
      label: "Accueil",
      isActive: location.pathname === "/dashboard",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      href: "/messages",
      label: "Messagerie",
      isActive: location.pathname.includes("/messages"),
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      href: "/network",
      label: "Réseau",
      isActive: location.pathname.includes("/network"),
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      href: "/jobs",
      label: "Emplois",
      isActive: location.pathname.includes("/jobs"),
      icon: <BriefcaseBusiness className="h-4 w-4 mr-2" />,
    },
    {
      href: "/courses",
      label: "Formations",
      isActive: location.pathname.includes("/courses"),
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
      roles: ['admin', 'professional', 'business'],
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      isActive: location.pathname.includes("/marketplace"),
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
    {
      href: "/browser",
      label: "Navigateur",
      isActive: location.pathname.includes("/browser"),
      icon: <Globe className="h-4 w-4 mr-2" />,
    },
    {
      href: "/notes",
      label: "Notes",
      isActive: location.pathname.includes("/notes"),
      icon: <NotebookPen className="h-4 w-4 mr-2" />,
    },
    {
      href: "/wallet",
      label: "Wallet",
      isActive: location.pathname.includes("/wallet"),
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      href: "/profile",
      label: "Profil",
      isActive: location.pathname.includes("/profile"),
      icon: <UserCircle className="h-4 w-4 mr-2" />,
    },
  ];

  // Filter nav items by role if user has a role
  const filteredNavItems = profile?.role
    ? navigationItems.filter(
        (item) => !item.roles || item.roles.includes(profile.role as UserRole)
      )
    : navigationItems;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden text-xl font-bold sm:inline-block text-white">
              Victaure
            </span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm">
            {filteredNavItems.map((item, i) => (
              <Button
                key={i}
                variant={item.isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 text-zinc-300",
                  item.isActive
                    ? "bg-zinc-800 text-white"
                    : "hover:bg-zinc-800/50"
                )}
                asChild
              >
                <Link to={item.href}>
                  <span className="flex items-center">
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="md:hidden mr-2">
          <Link to="/dashboard" className="flex items-center">
            <LayoutDashboard className="h-5 w-5 text-white mr-1" />
            <span className="font-bold text-white">Victaure</span>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationsDropdown />
          {profile && (
            <UserNav profile={profile} />
          )}
        </div>
      </div>
    </header>
  );
}
