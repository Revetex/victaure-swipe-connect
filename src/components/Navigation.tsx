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
import { useMediaQuery } from "@/hooks/use-media-query";

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(4);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

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
    <div className={cn(
      isLargeScreen ? "fixed inset-y-0 left-0 w-64 border-r" : "w-full h-full",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
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

      {/* Navigation Scroll Area */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="p-2 lg:p-4">
          {/* Principales */}
          <NavSection 
            title="Principales"
            items={navigationItems.slice(0, 2)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* Commerce & Jeux */}
          <NavSection 
            title="Commerce & Jeux"
            items={navigationItems.slice(2, 4)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* Productivité */}
          <NavSection 
            title="Productivité"
            items={navigationItems.slice(4, 7)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* Social */}
          <NavSection 
            title="Social"
            items={navigationItems.slice(7, 9)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* Paramètres */}
          <NavSection 
            title="Paramètres"
            items={navigationItems.slice(9)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
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

interface NavSectionProps {
  title: string;
  items: typeof navigationItems;
  currentPage: number;
  setCurrentPage: (id: number) => void;
}

function NavSection({ title, items, currentPage, setCurrentPage }: NavSectionProps) {
  return (
    <div className="space-y-1 mb-4">
      <h2 className="px-2 py-1 text-xs font-semibold text-muted-foreground">
        {title}
      </h2>
      {items.map((item) => (
        <NavItem 
          key={item.id}
          item={item}
          isActive={currentPage === item.id}
          onClick={() => setCurrentPage(item.id)}
        />
      ))}
    </div>
  );
}

interface NavItemProps {
  item: typeof navigationItems[0];
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  const Icon = item.icon;
  
  return (
    <motion.button
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium",
        "relative group transition-all duration-200",
        "hover:bg-accent",
        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
      )}
      onClick={onClick}
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
