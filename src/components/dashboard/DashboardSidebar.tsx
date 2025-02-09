
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";
import { Users, Bell, Newspaper, Briefcase, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { motion } from "framer-motion";

interface DashboardSidebarProps {
  currentPage: number;
  profile: any;
  onPageChange: (page: number) => void;
  onProfileClick: () => void;
}

export function DashboardSidebar({ 
  currentPage, 
  profile, 
  onPageChange,
  onProfileClick 
}: DashboardSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Logo />
      </div>
      <Separator />

      {profile && (
        <>
          <div className="p-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onProfileClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/80 backdrop-blur border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Users className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.full_name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {profile.role}
                </p>
              </div>
            </motion.div>
          </div>
          <Separator />
        </>
      )}

      {/* Bell Icon Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 h-12"
          onClick={() => onPageChange(0)}
        >
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </Button>
      </div>
      
      <Separator />

      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          <Button
            variant={currentPage === 1 ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-4 h-12",
              currentPage === 1 && "bg-primary/10 hover:bg-primary/20"
            )}
            onClick={() => onPageChange(1)}
          >
            <Newspaper className="h-5 w-5" />
            <span>Actualités</span>
          </Button>
          
          <Button
            variant={currentPage === 2 ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-4 h-12",
              currentPage === 2 && "bg-primary/10 hover:bg-primary/20"
            )}
            onClick={() => onPageChange(2)}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Button>
          
          <Button
            variant={currentPage === 3 ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-4 h-12",
              currentPage === 3 && "bg-primary/10 hover:bg-primary/20"
            )}
            onClick={() => onPageChange(3)}
          >
            <Briefcase className="h-5 w-5" />
            <span>Missions</span>
          </Button>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-4 h-12",
                  currentPage === item.id && "bg-primary/10 hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
