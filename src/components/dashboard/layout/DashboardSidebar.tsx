
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

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
      <div className="flex flex-col h-full bg-[#1B2A4A] border-r border-[#64B5D9]/10">
        <div className="p-6">
          <Logo />
          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setShowProfilePreview(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#F2EBE4]/80 hover:text-[#F2EBE4] hover:bg-[#64B5D9]/10 rounded-lg transition-colors"
            >
              <img
                src={completeProfile?.avatar_url || "/user-icon.svg"}
                alt={completeProfile?.full_name || ""}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-normal">Mon profil</span>
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isNotificationsItem = item.id === 9;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm",
                  "transition-colors duration-200",
                  currentPage === item.id 
                    ? "bg-[#2C3B5A] text-[#F2EBE4]"
                    : "text-[#F2EBE4]/60 hover:bg-[#2C3B5A] hover:text-[#F2EBE4]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
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
        </nav>

        <div className="p-6 mt-auto">
          <div className="flex justify-center opacity-60 hover:opacity-100 transition-all duration-300">
            <img 
              src="/lovable-uploads/168ba21b-e221-4668-96cc-eb026041a0ed.png" 
              alt="Signature" 
              className="h-8 w-auto"
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
