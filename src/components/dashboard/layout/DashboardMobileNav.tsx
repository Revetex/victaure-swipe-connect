
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { createEmptyProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";

interface DashboardMobileNavProps {
  currentPage: number;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  onPageChange: (page: number) => void;
}

export function DashboardMobileNav({
  currentPage,
  showMobileMenu,
  setShowMobileMenu,
  onPageChange
}: DashboardMobileNavProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const { getUnreadCount } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);

  const completeProfile = profile ? {
    ...createEmptyProfile(profile.id, profile.email || ''),
    ...profile
  } : null;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [getUnreadCount]);

  return (
    <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50" 
          aria-label="Ouvrir le menu" 
          title="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <div className="flex items-center justify-between p-4">
          <Logo />
          {completeProfile && (
            <Button
              variant="ghost"
              onClick={() => setShowProfilePreview(true)}
              className="w-10 h-10 p-0 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
            >
              <img
                src={completeProfile.avatar_url || "/user-icon.svg"}
                alt={completeProfile.full_name || ""}
                className="w-full h-full object-cover"
              />
            </Button>
          )}
        </div>

        <nav className="space-y-1 p-4" role="navigation" aria-label="Menu principal">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isNotificationsItem = item.id === 9;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setShowMobileMenu(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm relative",
                  "transition-colors",
                  currentPage === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
                aria-label={item.name}
                title={item.name}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.name}</span>
                {isNotificationsItem && unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {completeProfile && (
          <ProfilePreview
            profile={completeProfile}
            isOpen={showProfilePreview}
            onClose={() => setShowProfilePreview(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
