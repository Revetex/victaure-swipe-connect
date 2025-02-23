
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
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
      <div className="flex flex-col h-full bg-[#0EA5E9] dark:bg-[#0EA5E9]/90 relative overflow-hidden border-r-2 border-black">
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

        <div className="flex-1 px-3 py-2 overflow-y-auto">
          <nav className="space-y-3">
            {/* Section principale */}
            <div className="space-y-1">
              {mainItems.map(item => {
                const Icon = item.icon;
                const isNotificationsItem = item.id === 9;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm",
                      "transition-all duration-200 border-2 shadow-sm",
                      currentPage === item.id
                        ? "bg-white/15 text-white font-medium border-black shadow-inner"
                        : "text-white/90 hover:bg-white/10 hover:text-white border-black/20 hover:border-black"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-medium truncate">{item.name}</span>
                    {isNotificationsItem && unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto min-w-[20px] h-5">
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section réseau */}
            <div className="space-y-1">
              <div className="px-2 py-0.5 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Réseau
              </div>
              {networkItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm",
                      "transition-all duration-200 border-2 shadow-sm",
                      currentPage === item.id
                        ? "bg-white/15 text-white font-medium border-black shadow-inner"
                        : "text-white/90 hover:bg-white/10 hover:text-white border-black/20 hover:border-black"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-medium truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Section outils */}
            <div className="space-y-1">
              <div className="px-2 py-0.5 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Outils
              </div>
              {toolsItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm",
                      "transition-all duration-200 border-2 shadow-sm",
                      currentPage === item.id
                        ? "bg-white/15 text-white font-medium border-black shadow-inner"
                        : "text-white/90 hover:bg-white/10 hover:text-white border-black/20 hover:border-black"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-medium truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

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
