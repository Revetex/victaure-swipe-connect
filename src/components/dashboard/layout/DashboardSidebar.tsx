
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { createEmptyProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Coins } from "lucide-react";
import { PricingGrid } from "@/components/pricing/PricingGrid";

interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardSidebar({
  currentPage,
  onPageChange
}: DashboardSidebarProps) {
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

  // Grouper les éléments de navigation par catégorie
  const mainItems = navigationItems.slice(0, 6);
  const networkItems = navigationItems.slice(6, 8);
  const toolsItems = navigationItems.slice(8);

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-[#1A1F2C] border-r border-white/10">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Logo />
        </div>

        <div className="flex-1 overflow-auto px-2 py-2 space-y-4">
          {/* Menu principal */}
          <nav className="space-y-1">
            {mainItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant={currentPage === index ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    currentPage === index 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => onPageChange(index)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="ml-3">{item.name}</span>
                  {item.name === "Messages" && unreadCount > 0 && (
                    <Badge variant="default" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Section réseau */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">
              Réseau
            </h3>
            {networkItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index + 6}
                  variant={currentPage === index + 6 ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    currentPage === index + 6 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => onPageChange(index + 6)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="ml-3">{item.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Section outils */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">
              Outils
            </h3>
            {toolsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index + 8}
                  variant={currentPage === index + 8 ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    currentPage === index + 8 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => onPageChange(index + 8)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="ml-3">{item.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bouton Premium */}
        <div className="p-4 border-t border-white/10">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
              >
                <Coins className="h-4 w-4" />
                Premium
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <PricingGrid />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
