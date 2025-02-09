
import { 
  MessageSquare, 
  Settings, 
  ListTodo, 
  Calculator, 
  Languages, 
  Sword, 
  Users, 
  UserPlus, 
  Maximize2,
  LayoutDashboard,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedSidebar } from "./feed/FeedSidebar";
import { useState, useCallback } from "react";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface NavigationSection {
  title: string;
  items: {
    icon: any;
    label: string;
    to: string;
  }[];
}

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

  const navigationSections: NavigationSection[] = [
    {
      title: 'Principal',
      items: [
        { icon: LayoutDashboard, label: 'Tableau de bord', to: '/dashboard' },
        { icon: MessageSquare, label: 'Messages', to: '/dashboard/messages' },
      ]
    },
    {
      title: 'Outils',
      items: [
        { icon: ListTodo, label: 'Notes & Tâches', to: '/dashboard/tools' },
        { icon: Calculator, label: 'Calculatrice', to: '/dashboard/tools?tool=calculator' },
        { icon: Languages, label: 'Traducteur', to: '/dashboard/tools?tool=translator' },
        { icon: Sword, label: 'Échecs', to: '/dashboard/tools?tool=chess' },
      ]
    },
    {
      title: 'Social',
      items: [
        { icon: Users, label: 'Mes Connections', to: '/dashboard/connections' },
        { icon: UserPlus, label: 'Demandes en attente', to: '/dashboard/requests' },
      ]
    },
    {
      title: 'Paramètres',
      items: [
        { icon: Settings, label: 'Paramètres', to: '/settings' },
      ]
    }
  ];

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
            <Collapsible
              key={section.title}
              open={openSections.includes(section.title.toLowerCase())}
              onOpenChange={() => toggleSection(section.title.toLowerCase())}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between px-2 py-1 h-8 text-sm"
                >
                  <span className="font-medium">{section.title}</span>
                  {openSections.includes(section.title.toLowerCase()) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200",
                      "text-muted-foreground hover:text-foreground text-sm",
                      "hover:bg-[#9b87f5]/10 active:scale-[0.98]",
                      "group relative"
                    )}
                  >
                    <item.icon className="h-4 w-4 transition-colors duration-200" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
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

