
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
      <div className="flex flex-col h-full bg-[#64B5D9] dark:bg-[#64B5D9]/5 backdrop-blur-sm supports-[backdrop-filter]:bg-[#64B5D9]/90 dark:supports-[backdrop-filter]:bg-[#64B5D9]/5">
        <div className="flex items-center justify-between p-4 relative z-50">
          <Logo />
          {completeProfile && (
            <Button 
              variant="ghost" 
              onClick={() => setShowProfilePreview(true)} 
              className="w-10 h-10 p-0 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all transform hover:scale-105 cursor-pointer relative z-50"
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
          <nav className="space-y-2">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isNotificationsItem = item.id === 9;
              return (
                <button 
                  key={item.id} 
                  onClick={() => onPageChange(item.id)} 
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm relative",
                    "transition-all duration-300 ease-out",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "hover:bg-white/10",
                    currentPage === item.id 
                      ? "bg-white/15 text-white font-medium shadow-sm" 
                      : "text-white/90 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
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
