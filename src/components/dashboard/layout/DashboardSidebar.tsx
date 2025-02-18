
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
import { UserAvatar } from "@/components/UserAvatar";

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
                  "w-full justify-start gap-2 font-normal h-11",
                  "hover:bg-primary/10 hover:text-primary",
                  currentPage === item.id && "bg-primary/15 text-primary",
                  "transition-colors duration-200"
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
        <div className="p-4 border-t bg-background/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto p-2"
            onClick={() => setShowProfilePreview(true)}
          >
            <UserAvatar
              user={profile}
              className="h-8 w-8"
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{profile.full_name}</span>
              <span className="text-xs text-muted-foreground">{profile.role}</span>
            </div>
          </Button>
        </div>
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
