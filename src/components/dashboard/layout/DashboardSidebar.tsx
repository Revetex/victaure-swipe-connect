
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
import { Link } from "react-router-dom";

interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardSidebar({
  currentPage,
  onPageChange,
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

  const handlePageClick = (pageId: number, route: string) => {
    onPageChange(pageId);
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
      <div className="flex flex-col flex-grow bg-[#1B2A4A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1B2A4A]/60 border-r border-[#64B5D9]/10">
        <div className="flex items-center justify-between p-4">
          <Logo />
          {completeProfile && (
            <Button
              variant="ghost"
              onClick={() => setShowProfilePreview(true)}
              className="w-10 h-10 p-0 rounded-full overflow-hidden ring-2 ring-[#64B5D9]/20 hover:ring-[#64B5D9]/40 transition-all transform hover:scale-105"
            >
              <img
                src={completeProfile.avatar_url || "/user-icon.svg"}
                alt={completeProfile.full_name || ""}
                className="w-full h-full object-cover"
              />
            </Button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isNotificationsItem = item.id === 9;
            return (
              <button
                key={item.id}
                onClick={() => handlePageClick(item.id, item.route)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm relative",
                  "transition-all duration-300 ease-out",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "border border-transparent",
                  currentPage === item.id 
                    ? "bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/5 text-[#64B5D9] font-medium border-[#64B5D9]/10 shadow-sm"
                    : "text-[#F2EBE4]/60 hover:bg-[#64B5D9]/10 hover:text-[#F2EBE4] hover:border-[#64B5D9]/20"
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

        <div className="p-4 mt-auto border-t border-[#64B5D9]/10">
          <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300">
            <img 
              src="/lovable-uploads/168ba21b-e221-4668-96cc-eb026041a0ed.png" 
              alt="Signature" 
              className="h-8 w-auto mix-blend-luminosity hover:scale-105 transition-transform"
            />
          </div>
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
