
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigationItems } from "@/config/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { ProfileSection } from "./sidebar/ProfileSection";
import { NavigationSection } from "./sidebar/NavigationSection";

interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardSidebar({ currentPage, onPageChange }: DashboardSidebarProps) {
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  if (!profile) return null;

  const sections = [
    { title: "Principales", items: navigationItems.slice(0, 2) },
    { title: "Commerce & Jeux", items: navigationItems.slice(2, 4) },
    { title: "Productivité", items: navigationItems.slice(4, 7) },
    { title: "Social", items: navigationItems.slice(7, 9) },
    { title: "Paramètres", items: navigationItems.slice(9) }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-56 bg-background border-r hidden lg:flex flex-col">
      <ProfileSection
        profile={profile}
        showProfilePreview={showProfilePreview}
        onProfileClick={() => setShowProfilePreview(true)}
        onClosePreview={() => setShowProfilePreview(false)}
      />

      <ScrollArea className="flex-1 py-2">
        <nav className="px-1.5 space-y-2">
          {sections.map((section) => (
            <NavigationSection
              key={section.title}
              title={section.title}
              items={section.items}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
