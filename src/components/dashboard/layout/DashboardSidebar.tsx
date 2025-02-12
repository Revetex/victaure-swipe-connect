
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
      {profile && (
        <>
          <div className="p-4 border-b border-border/40">
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

      <ScrollArea className="flex-1">
        <nav className="p-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-medium tracking-tight",
                  "h-11 px-4 relative group transition-colors duration-200",
                  "bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                  "data-[state=open]:bg-accent",
                  currentPage === item.id ? 
                    "text-primary bg-primary/10 hover:bg-primary/15" : 
                    "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  currentPage === item.id && "text-primary"
                )} />
                <span>{item.name}</span>
                {currentPage === item.id && (
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
    </motion.aside>
  );
}
