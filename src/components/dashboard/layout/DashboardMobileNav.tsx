
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { navigationItems } from "@/config/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  const userProfile: UserProfile = {
    id: user?.id || '',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || null,
    avatar_url: user?.user_metadata?.avatar_url || null,
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: [],
    latitude: null,
    longitude: null
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/80 backdrop-blur lg:hidden">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <div className="flex h-14 items-center px-4">
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
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
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setShowMobileMenu(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.id * 0.1 }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                    "transition-colors duration-200",
                    currentPage === item.id 
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  aria-label={item.name}
                  title={item.name}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {userProfile && (
        <ProfilePreview
          profile={userProfile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </header>
  );
}
