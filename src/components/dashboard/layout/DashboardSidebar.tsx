
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
import { ScrollArea } from "@/components/ui/scroll-area";
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

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
      <div className="flex flex-col h-full bg-[#64B5D9] relative overflow-hidden border-r-2 border-black">
        {/* Motif de fond */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url('/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png')`,
            backgroundSize: '150px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat'
          }}
        />

        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-black/5 relative z-10">
          <Logo />
          {completeProfile && (
            <Button 
              variant="ghost" 
              onClick={() => setShowProfilePreview(true)} 
              className="w-10 h-10 p-0 rounded-full overflow-hidden ring-2 ring-black/20 hover:ring-black/40 transition-all transform hover:scale-105 cursor-pointer"
            >
              <img 
                src={completeProfile.avatar_url || "/user-icon.svg"} 
                alt={completeProfile.full_name || ""} 
                className="w-full h-full object-cover" 
              />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 px-4 py-2">
          <nav className="space-y-1.5">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isNotificationsItem = item.id === 9;
              return (
                <button 
                  key={item.id} 
                  onClick={() => onPageChange(item.id)} 
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                    "transition-all duration-200 border-2 shadow-sm",
                    currentPage === item.id 
                      ? "bg-white/15 text-white font-medium border-black shadow-inner" 
                      : "text-white/90 hover:bg-white/10 hover:text-white border-black/20 hover:border-black"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="font-medium">{item.name}</span>
                  {isNotificationsItem && unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto min-w-[20px] h-5"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              );
            })}

            {/* Bouton Tarifs */}
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                    transition-all duration-200 border-2 shadow-sm
                    bg-white/10 text-white font-medium border-black hover:bg-white/15"
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span className="font-medium">Voir les tarifs</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto bg-[#1B2A4A] border-2 border-black">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Tarifs Victaure 2024
                  </h2>
                  <PricingGrid />
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </ScrollArea>

        {completeProfile && (
          <ProfilePreview 
            profile={completeProfile} 
            isOpen={showProfilePreview} 
            onClose={() => setShowProfilePreview(false)} 
          />
        )}
      </div>
    </div>
  );
}
