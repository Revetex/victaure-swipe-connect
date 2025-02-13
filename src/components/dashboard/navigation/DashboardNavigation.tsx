
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
  className?: string;
}

export function DashboardNavigation({ 
  currentPage, 
  onPageChange,
  isEditing,
  className 
}: DashboardNavigationProps) {
  const { user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  if (isEditing) return null;

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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="fixed top-4 right-4">
        <NotificationsBox />
      </div>

      <div className={cn(
        "flex items-center justify-around w-full max-w-2xl mx-auto h-16 px-4",
        "lg:h-20 lg:px-8",
        className
      )}>
        {navigationItems.map((item) => {
          if (!isLargeScreen && item.id > 6) return null;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "nav-item",
                currentPage === item.id && "active",
                "flex flex-col items-center justify-center gap-1 px-3 py-2",
                "hover:bg-accent/50 rounded-lg transition-colors"
              )}
              title={item.name}
              aria-label={item.name}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => setShowProfilePreview(true)}
          className={cn(
            "nav-item flex flex-col items-center justify-center gap-1 px-3 py-2",
            "hover:bg-accent/50 rounded-lg transition-colors"
          )}
          title="Mon profil"
          aria-label="Mon profil"
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium">Profil</span>
        </button>
      </div>

      {userProfile && (
        <ProfilePreview
          profile={userProfile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </div>
  );
}
