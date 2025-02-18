
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { createEmptyProfile } from "@/types/profile";
import { useState } from "react";

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

  const completeProfile = profile ? {
    ...createEmptyProfile(profile.id, profile.email || ''),
    ...profile
  } : null;

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
      <div className="flex flex-col flex-grow bg-background/95 backdrop-blur-sm border-r">
        <div className="flex items-center justify-between p-4">
          <Logo />
          {completeProfile && (
            <Button
              variant="ghost"
              onClick={() => setShowProfilePreview(true)}
              className="w-10 h-10 p-0 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
            >
              <img
                src={completeProfile.avatar_url || "/user-icon.svg"}
                alt={completeProfile.full_name || ""}
                className="w-full h-full object-cover"
              />
            </Button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  "transition-colors",
                  currentPage === item.id 
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
                aria-label={item.name}
                title={item.name}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

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
