import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { useProfile } from "@/hooks/useProfile";
import { createEmptyProfile } from "@/types/profile";

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
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  if (isEditing) return null;

  const completeProfile = profile ? {
    ...createEmptyProfile(profile.id, profile.email || ''),
    ...profile
  } : null;

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
    longitude: null,
    online_status: false,
    last_seen: new Date().toISOString()
  };

  return (
    <>
      <div className={cn("flex items-center justify-around w-full max-w-2xl mx-auto", className)}>
        {navigationItems.map(({ id, icon: Icon, name }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={cn(
              "p-3 rounded-xl transition-colors",
              "touch-manipulation min-h-[44px] min-w-[44px]",
              "active:scale-95",
              currentPage === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary"
            )}
            title={name}
            aria-label={name}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">{name}</span>
          </button>
        ))}
        
        <button
          onClick={() => setShowProfilePreview(true)}
          className={cn(
            "p-3 rounded-xl transition-colors",
            "touch-manipulation min-h-[44px] min-w-[44px]",
            "active:scale-95",
            "text-muted-foreground hover:text-primary"
          )}
          title="Mon profil"
          aria-label="Mon profil"
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Profil</span>
        </button>
      </div>

      {completeProfile && (
        <ProfilePreview
          profile={completeProfile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </>
  );
}
