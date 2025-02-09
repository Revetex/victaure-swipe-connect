
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
  LayoutDashboard 
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

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const navigationItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Tableau de bord', 
      to: '/dashboard'
    },
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      to: '/dashboard/messages'
    },
    { 
      icon: ListTodo, 
      label: 'Notes & Tâches', 
      to: '/dashboard/tools'
    },
    { 
      icon: Calculator, 
      label: 'Calculatrice', 
      to: '/dashboard/tools?tool=calculator'
    },
    { 
      icon: Languages, 
      label: 'Traducteur', 
      to: '/dashboard/tools?tool=translator'
    },
    { 
      icon: Sword, 
      label: 'Échecs', 
      to: '/dashboard/tools?tool=chess'
    },
    {
      icon: Users,
      label: 'Mes Connections',
      to: '/dashboard/connections'
    },
    {
      icon: UserPlus,
      label: 'Demandes en attente',
      to: '/dashboard/requests'
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      to: '/settings'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo Section */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <motion.div 
          className="flex items-center gap-3 group cursor-pointer"
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
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-[#9b87f5]/10 active:scale-[0.98]",
                "group relative"
              )}
            >
              <item.icon className="h-5 w-5 transition-colors duration-200" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          <FeedSidebar />
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="h-16 border-t bg-background/50 backdrop-blur flex items-center justify-between px-4">
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
