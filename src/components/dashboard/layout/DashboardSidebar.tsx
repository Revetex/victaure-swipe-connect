
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
    <aside className="fixed inset-y-0 left-0 z-50 w-56 bg-background border-r hidden lg:flex flex-col">
      {/* Profile Section */}
      {profile && (
        <div className="p-2 border-b">
          <button
            onClick={() => setShowProfilePreview(true)}
            className="w-full bg-accent/50 hover:bg-accent transition-colors rounded-md p-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || ""}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {profile.full_name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">
                  {profile.full_name || "Utilisateur"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.role}
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="px-1.5 space-y-2">
          {/* Principales */}
          <div className="space-y-0.5">
            <div className="px-2 py-1">
              <h2 className="text-xs font-semibold text-muted-foreground">Principales</h2>
            </div>
            {navigationItems.slice(0, 2).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-medium h-8",
                  "relative group transition-all duration-200",
                  "hover:bg-accent",
                  currentPage === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  currentPage === item.id && "text-primary"
                )} />
                {item.name}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 inset-y-1 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Commerce & Jeux */}
          <div className="space-y-0.5">
            <div className="px-2 py-1">
              <h2 className="text-xs font-semibold text-muted-foreground">Commerce & Jeux</h2>
            </div>
            {navigationItems.slice(2, 4).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-medium h-8",
                  "relative group transition-all duration-200",
                  "hover:bg-accent",
                  currentPage === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  currentPage === item.id && "text-primary"
                )} />
                {item.name}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 inset-y-1 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Productivité */}
          <div className="space-y-0.5">
            <div className="px-2 py-1">
              <h2 className="text-xs font-semibold text-muted-foreground">Productivité</h2>
            </div>
            {navigationItems.slice(4, 7).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-medium h-8",
                  "relative group transition-all duration-200",
                  "hover:bg-accent",
                  currentPage === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  currentPage === item.id && "text-primary"
                )} />
                {item.name}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 inset-y-1 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Social */}
          <div className="space-y-0.5">
            <div className="px-2 py-1">
              <h2 className="text-xs font-semibold text-muted-foreground">Social</h2>
            </div>
            {navigationItems.slice(7, 9).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-medium h-8",
                  "relative group transition-all duration-200",
                  "hover:bg-accent",
                  currentPage === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  currentPage === item.id && "text-primary"
                )} />
                {item.name}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 inset-y-1 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Paramètres */}
          <div className="space-y-0.5">
            <div className="px-2 py-1">
              <h2 className="text-xs font-semibold text-muted-foreground">Paramètres</h2>
            </div>
            {navigationItems.slice(9).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-medium h-8",
                  "relative group transition-all duration-200",
                  "hover:bg-accent",
                  currentPage === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  "transition-transform duration-200",
                  "group-hover:scale-110",
                  currentPage === item.id && "text-primary"
                )} />
                {item.name}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 inset-y-1 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            ))}
          </div>
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
