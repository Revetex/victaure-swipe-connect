
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="hidden lg:flex flex-col w-64 border-r fixed h-screen glass-panel"
    >
      <div className="p-4">
        <Logo />
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 font-normal",
                  "hover:bg-primary/10 hover:text-primary",
                  currentPage === item.id && "bg-primary/15 text-primary"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {profile && (
        <>
          <Separator />
          <div className="p-4">
            <button
              onClick={() => setShowProfilePreview(true)}
              className="w-full gradient-border"
            >
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || ""}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {profile.full_name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium truncate text-sm">
                    {profile.full_name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.role}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </>
      )}

      {profile && (
        <ProfilePreview
          profile={profile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </motion.aside>
  );
}
