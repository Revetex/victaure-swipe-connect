
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

export function DashboardSidebar({
  currentPage,
  onPageChange
}: DashboardSidebarProps) {
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-background/50 backdrop-blur-lg">
      <div className="p-6">
        <Logo />
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1" role="navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm justify-start",
                  "transition-colors",
                  currentPage === item.id 
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="my-4" />
      
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 px-3 py-2"
          onClick={() => setShowProfilePreview(true)}
        >
          <UserAvatar user={profile} className="h-8 w-8" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </Button>
      </div>

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
