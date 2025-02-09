
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedSidebar } from "./feed/FeedSidebar";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { NavigationSection } from "./navigation/NavigationSection";
import { navigationSections } from "./navigation/navigationConfig";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { NavigationFooter } from "./navigation/NavigationFooter";

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
      <NavigationHeader 
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onShowProfile={() => setShowProfilePreview(true)}
      />

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

      <NavigationFooter />

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
