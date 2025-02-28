
import { Link } from "react-router-dom";
import { Home, Briefcase, Bell, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppFooter() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  // Ne pas afficher sur les grandes tailles d'écran ou quand non authentifié
  if (!isAuthenticated || !isMobile) {
    return null;
  }

  // Navigation mobile
  const mobileNavItems = [
    { name: "Accueil", icon: Home, path: "/" },
    { name: "Emplois", icon: Briefcase, path: "/jobs" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Profil", icon: User, path: "/profile" },
  ];

  return (
    <div className="mobile-nav pb-safe fixed bottom-0 left-0 right-0 z-40 bg-[#1B2A4A]/95 backdrop-blur-md border-t border-[#64B5D9]/20">
      <div className="flex justify-around items-center">
        {mobileNavItems.map((item) => (
          <Link key={item.path} to={item.path} className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full h-16 flex flex-col justify-center items-center gap-1 rounded-none",
                "text-white/60 hover:text-white hover:bg-white/5",
                location.pathname === item.path && "text-[#64B5D9] bg-white/5"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.name}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
