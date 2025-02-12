
import { MessageSquare, Settings, Newspaper, ListTodo, SwordIcon, ShoppingBag, Calculator, Languages, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigationItems } from "@/config/navigation";

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(4);

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
      <ScrollArea className="flex-1 py-6">
        <nav className="px-2 space-y-6">
          {/* Principales */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Principales</h2>
            </div>
            {navigationItems.slice(0, 2).map((item) => renderNavItem(item, currentPage, setCurrentPage))}
          </div>

          {/* Commerce & Jeux */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Commerce & Jeux</h2>
            </div>
            {navigationItems.slice(2, 4).map((item) => renderNavItem(item, currentPage, setCurrentPage))}
          </div>

          {/* Productivité */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Productivité</h2>
            </div>
            {navigationItems.slice(4, 7).map((item) => renderNavItem(item, currentPage, setCurrentPage))}
          </div>

          {/* Social */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Social</h2>
            </div>
            {navigationItems.slice(7, 9).map((item) => renderNavItem(item, currentPage, setCurrentPage))}
          </div>

          {/* Paramètres */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground">Paramètres</h2>
            </div>
            {navigationItems.slice(9).map((item) => renderNavItem(item, currentPage, setCurrentPage))}
          </div>
        </nav>
      </ScrollArea>

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

function renderNavItem(item: typeof navigationItems[0], currentPage: number, setCurrentPage: (id: number) => void) {
  const Icon = item.icon;
  const isActive = currentPage === item.id;
  
  return (
    <motion.button
      key={item.id}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium",
        "relative group transition-all duration-200",
        "hover:bg-accent",
        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
      )}
      onClick={() => setCurrentPage(item.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className={cn(
        "h-4 w-4 shrink-0",
        "transition-transform duration-200",
        "group-hover:scale-110",
        isActive && "text-primary"
      )} />
      <span>{item.name}</span>
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute left-0 w-1 inset-y-1 bg-primary rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.button>
  );
}
