
import { MessageSquare, Settings, ListTodo, Calculator, Languages, Sword } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedSidebar } from "./feed/FeedSidebar";
import { useState } from "react";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

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

  const navigationItems = [
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
      icon: Settings, 
      label: 'Paramètres', 
      to: '/settings'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="h-16 border-b flex items-center px-4">
        <motion.div 
          className="flex items-center gap-3 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => setShowProfilePreview(true)}
        >
          <Logo size="sm" />
        </motion.div>
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-accent/50 active:scale-[0.98]"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <FeedSidebar />
        </nav>
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
