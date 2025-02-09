
import { Maximize2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedSidebar } from "./feed/FeedSidebar";
import { useState, useCallback } from "react";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { Button } from "./ui/button";
import { NavigationSection } from "./navigation/NavigationSection";
import { navigationSections } from "./navigation/navigationConfig";

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['main', 'tools', 'social']);

  const toggleSection = (section: string) => {
    setOpenSections(current => 
      current.includes(section) 
        ? current.filter(s => s !== section)
        : [...current, section]
    );
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (isLoading || !user) {
    return null;
  }

  const userProfile: UserProfile = {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
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
    <div className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo Section */}
      <div className="h-12 border-b flex items-center justify-between px-3">
        <motion.div 
          className="flex items-center gap-2 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => setShowProfilePreview(true)}
        >
          <Logo size="sm" />
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="hover:bg-accent/50"
          title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-2">
          {navigationSections.map((section) => (
            <NavigationSection
              key={section.title}
              section={section}
              isOpen={openSections.includes(section.title.toLowerCase())}
              onToggle={() => toggleSection(section.title.toLowerCase())}
            />
          ))}
        </nav>

        <div className="mt-4">
          <FeedSidebar />
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="h-12 border-t bg-background/50 backdrop-blur flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <NotificationsBox />
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Preview */}
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
