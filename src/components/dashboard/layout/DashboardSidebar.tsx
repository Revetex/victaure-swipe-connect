
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigationItems } from "@/config/navigation";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";

interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardSidebar({ currentPage, onPageChange }: DashboardSidebarProps) {
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r hidden lg:flex flex-col">
      {/* Profile Section */}
      {profile && (
        <div className="p-4 border-b">
          <button
            onClick={() => setShowProfilePreview(true)}
            className="w-full bg-accent/50 hover:bg-accent transition-colors rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || ""}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {profile.full_name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium truncate">
                  {profile.full_name || "Utilisateur"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {profile.role}
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-6">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-medium",
                  "relative group transition-all duration-200",
                  "hover:bg-accent",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  isActive && "text-primary"
                )} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 inset-y-1 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {profile && (
        <ProfilePreview
          profile={profile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </aside>
  );
}
