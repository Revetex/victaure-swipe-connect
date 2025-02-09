
import { 
  MessageSquare, Settings, ListTodo, Calculator, 
  Languages, Sword, Users, UserPlus, ChevronDown,
  Wrench, Bell, Moon, Lock, EyeOff, LogOut
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  const toolItems = [
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
  ];

  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      to: '/settings/notifications'
    },
    {
      icon: Moon,
      label: 'Apparence',
      to: '/settings/appearance'
    },
    {
      icon: Lock,
      label: 'Sécurité',
      to: '/settings/security'
    },
    {
      icon: EyeOff,
      label: 'Confidentialité',
      to: '/settings/privacy'
    },
    {
      icon: LogOut,
      label: 'Déconnexion',
      to: '/settings/logout'
    }
  ];

  const mainItems = [
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      to: '/dashboard/messages'
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
    }
  ];

  return (
    <div className="h-full flex flex-col">
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

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-6">
          <div className="space-y-2">
            {mainItems.map((item) => (
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

            <Collapsible
              open={openTools}
              onOpenChange={setOpenTools}
              className="space-y-2"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-accent/50">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Outils</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    openTools && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {toolItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-accent/50 ml-4"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{item.label}</span>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSettings}
              onOpenChange={setOpenSettings}
              className="space-y-2"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-accent/50">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Paramètres</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    openSettings && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {settingsItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-accent/50 ml-4"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{item.label}</span>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </nav>
      </ScrollArea>

      <div className="h-16 border-t bg-background/50 backdrop-blur flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <NotificationsBox />
          <ThemeToggle />
        </div>
      </div>

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
