
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { motion } from "framer-motion";
import { ToolsList } from "./sidebar/ToolsList";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { Home, MessageSquare, BriefcaseIcon, Newspaper, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
    navigate('/tools');
  };

  const handleProfileSelect = (profile: UserProfile) => {
    navigate(`/profile/${profile.id}`);
  };

  const menuItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: BriefcaseIcon, label: "Emplois", path: "/jobs" },
    { icon: Newspaper, label: "Actualités", path: "/news" },
  ];

  return (
    <motion.div 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm shadow-sm border-b z-[99998]",
        className
      )}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      exit={{ y: -64 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Recherche */}
          <div className="flex-1 max-w-md mx-4">
            <ProfileSearch 
              onSelect={handleProfileSelect}
              placeholder="Rechercher des profils..."
              className="w-full"
            />
          </div>

          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
              <SheetTitle className="p-6 border-b">Menu principal</SheetTitle>
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-6 space-y-6">
                  {/* Navigation mobile */}
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>

                  {/* Outils */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase mb-2">
                      Outils
                    </h3>
                    <ToolsList onToolClick={handleToolClick} />
                  </div>

                  {/* Connexions */}
                  <ConnectionsSection />

                  {/* Paramètres */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase mb-2">
                      Paramètres
                    </h3>
                    <div className="space-y-2">
                      <AppearanceSection />
                      <NotificationsSection />
                      <PrivacySection />
                      <SecuritySection />
                      <BlockedUsersSection />
                      <LogoutSection />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
