
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";

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

  if (isEditing) return null;

  // Convert User to UserProfile type for ProfilePreview
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
    <>
      <div className="fixed top-4 right-4 z-50">
        <NotificationsBox />
      </div>

      <div className={cn("flex items-center justify-around w-full max-w-2xl mx-auto", className)}>
        {navigationItems.map(({ id, icon: Icon, name, children }) => {
          const isTools = id === 5;
          const isActive = currentPage === id || (isTools && children?.some(child => child.id === currentPage));

          return (
            <motion.button
              key={id}
              onClick={() => {
                if (isTools) {
                  setExpandedTools(!expandedTools);
                } else {
                  onPageChange(id);
                }
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: id * 0.1 }}
              className={cn(
                "p-3 rounded-xl transition-all duration-300 flex flex-col items-center relative",
                "hover:bg-primary/10 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "touch-manipulation min-h-[44px] min-w-[44px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-primary"
              )}
              title={name}
              aria-label={name}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium mt-1">{name}</span>
              {isTools && (
                <ChevronDown className={cn(
                  "h-3 w-3 mt-1 transition-transform",
                  expandedTools && "rotate-180"
                )} />
              )}

              {/* Sous-menu des outils */}
              {isTools && expandedTools && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 bg-background rounded-lg shadow-lg border p-2 min-w-[150px] z-50"
                >
                  {children?.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPageChange(tool.id);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                        "hover:bg-primary/10 transition-colors",
                        currentPage === tool.id ? "bg-primary text-primary-foreground" : "text-foreground"
                      )}
                    >
                      <tool.icon className="h-4 w-4" />
                      <span>{tool.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.button>
          );
        })}
        
        <motion.button
          onClick={() => setShowProfilePreview(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: navigationItems.length * 0.1 }}
          className={cn(
            "p-3 rounded-xl transition-all duration-300 flex flex-col items-center",
            "hover:bg-primary/10 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "touch-manipulation min-h-[44px] min-w-[44px]",
            "text-muted-foreground hover:text-primary"
          )}
          title="Mon profil"
          aria-label="Mon profil"
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Profil</span>
        </motion.button>
      </div>

      {userProfile && (
        <ProfilePreview
          profile={userProfile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </>
  );
}
