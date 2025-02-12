
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
  const [expandedTools, setExpandedTools] = useState(false);
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
        {navigationItems.map(({ id, icon: Icon, name, children }) => {
          const isTools = id === 5;
          const isActive = currentPage === id || (isTools && children?.some(child => child.id === currentPage));

          if (!isLargeScreen && id > 6) return null;

          return (
            <button
              key={id}
              onClick={() => {
                if (isTools) {
                  setExpandedTools(!expandedTools);
                } else {
                  onPageChange(id);
                }
              }}
              className={cn(
                "nav-item",
                isActive && "active",
                "flex flex-col items-center justify-center gap-1 px-3 py-2",
                "hover:bg-accent/50 rounded-lg transition-colors"
              )}
              title={name}
              aria-label={name}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{name}</span>
              {isTools && (
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform",
                  expandedTools && "rotate-180"
                )} />
              )}

              {isTools && expandedTools && (
                <div className="nav-tools-menu absolute bottom-full left-0 w-full bg-background border rounded-lg shadow-lg p-2 mb-2">
                  {children?.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPageChange(tool.id);
                        setExpandedTools(false);
                      }}
                      className={cn(
                        "nav-tools-item w-full flex items-center gap-2 px-3 py-2 rounded-md",
                        "hover:bg-accent/50 transition-colors",
                        currentPage === tool.id && "bg-primary/20 text-primary"
                      )}
                    >
                      <tool.icon className="h-4 w-4" />
                      <span>{tool.name}</span>
                    </button>
                  ))}
                </div>
              )}
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
