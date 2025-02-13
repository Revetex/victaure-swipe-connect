
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigationSections } from "@/config/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Separator } from "./ui/separator";

interface NavigationProps {
  onNavigate?: () => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(4);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();

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

      {/* Navigation Sections */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="p-4 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground px-2">
                {section.name}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavButton
                    key={item.id}
                    item={item}
                    isActive={currentPage === item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      navigate(`/${item.path}`);
                      onNavigate?.();
                    }}
                  />
                ))}
              </div>
              {section.id !== "settings" && (
                <Separator className="mt-4 opacity-50" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

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

interface NavButtonProps {
  item: typeof navigationSections[0]['items'][0];
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  const Icon = item.icon;
  
  return (
    <motion.button
      className={cn(
        "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium",
        "relative group transition-all duration-200",
        "hover:bg-accent/50",
        isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-foreground/70 hover:text-foreground"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
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
