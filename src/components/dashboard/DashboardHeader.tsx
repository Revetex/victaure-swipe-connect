import { Logo } from "@/components/Logo";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  currentPage: number;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export function DashboardHeader({ currentPage, isSearchOpen, setIsSearchOpen }: DashboardHeaderProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const getPageTitle = (page: number) => {
    switch (page) {
      case 1:
        return "Profil";
      case 2:
        return "Messages";
      case 3:
        return "Emplois";
      case 4:
        return "Actualités";
      case 5:
        return "Outils";
      case 6:
        return "Paramètres";
      default:
        return "";
    }
  };

  const handleProfileSelect = (profile: any) => {
    if (profile?.id) {
      navigate(`/profile/${profile.id}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-2 px-4 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Logo size="sm" />
                <h1 className="text-xl font-bold text-primary">VICTAURE</h1>
              </div>
              <div className="h-6 w-px bg-border mx-2" />
              <h2 className="text-lg font-semibold text-foreground">
                {getPageTitle(currentPage)}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {isMobile ? (
                <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Search className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="w-full p-4">
                    <ProfileSearch 
                      onSelect={handleProfileSelect}
                      placeholder="Rechercher un profil..."
                      className="w-full"
                    />
                  </SheetContent>
                </Sheet>
              ) : (
                <div className="w-[300px]">
                  <ProfileSearch 
                    onSelect={handleProfileSelect}
                    placeholder="Rechercher un profil..."
                    className="w-full"
                  />
                </div>
              )}
              <NotificationsBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}