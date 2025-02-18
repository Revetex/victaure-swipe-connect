
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { createEmptyProfile } from "@/types/profile";

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
  
  const completeProfile = profile ? {
    ...createEmptyProfile(profile.id, profile.email || ''),
    ...profile
  } : null;

  const [showProfilePreview, setShowProfilePreview] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur shadow-sm">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <div className="flex h-16 items-center px-4 pt-safe-top">
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:flex"
              aria-label="Ouvrir le menu"
              title="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </SheetTrigger>
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
        </div>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <Logo />
          </div>
          <nav className="space-y-1 p-4" role="navigation" aria-label="Menu principal">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm justify-start",
                    "transition-colors",
                    currentPage === item.id 
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() => {
                    onPageChange(item.id);
                    setShowMobileMenu(false);
                  }}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {completeProfile && (
        <ProfilePreview
          profile={completeProfile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </header>
  );
}
