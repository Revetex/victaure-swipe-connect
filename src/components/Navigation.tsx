
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { MainItems } from "./navigation/MainItems";
import { ToolsSection } from "./navigation/ToolsSection";
import { SettingsSection } from "./navigation/SettingsSection";
import { NavigationFooter } from "./navigation/NavigationFooter";

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [openTools, setOpenTools] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  // Convert User to UserProfile type
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
    <div className="h-full flex flex-col">
      <NavigationHeader onShowProfilePreview={() => setShowProfilePreview(true)} />

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-6">
          <div className="space-y-2">
            <MainItems />
            <ToolsSection openTools={openTools} setOpenTools={setOpenTools} />
            <SettingsSection openSettings={openSettings} setOpenSettings={setOpenSettings} />
          </div>
        </nav>
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
