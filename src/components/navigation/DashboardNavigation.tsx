
import { cn } from "@/lib/utils";
import { navigationSections } from "@/config/navigation";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
  className?: string;
}

export function DashboardNavigation({ 
  currentPage, 
  onPageChange,
  isEditing,
  className 
}: DashboardNavigationProps) {
  const { user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  if (isEditing) return null;

  const userProfile: UserProfile = {
    id: user?.id || '',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || null,
    avatar_url: user?.user_metadata?.avatar_url || null,
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

  const renderNavigationContent = () => (
    <ScrollArea className="h-full py-2">
      <div className="space-y-4 p-2">
        {navigationSections.map((section) => (
          <motion.div 
            key={section.id} 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground">
                {section.name}
              </h4>
              {section.description && (
                <p className="text-xs text-muted-foreground/80">
                  {section.description}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              {section.items.map((item) => (
                <TooltipProvider key={item.id}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => {
                          onPageChange(item.id);
                          if (!isLargeScreen) setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                          "transition-all duration-200 hover:bg-accent group",
                          "relative overflow-hidden",
                          currentPage === item.id && "bg-primary/10 text-primary"
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 shrink-0",
                          "transition-transform duration-200 group-hover:scale-110",
                          currentPage === item.id && "text-primary"
                        )} />
                        <span className="font-medium">{item.name}</span>
                        {currentPage === item.id && (
                          <motion.div
                            layoutId="active-nav"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px]">
                      <p>{item.description || item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            
            {section.id !== "compte" && (
              <Separator className="my-2" />
            )}
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );

  // Version mobile
  if (!isLargeScreen) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg bg-background/95 backdrop-blur"
            >
              <User className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            {renderNavigationContent()}
          </SheetContent>
        </Sheet>

        <div className="fixed top-4 right-4 z-50">
          <NotificationsBox />
        </div>
      </>
    );
  }

  // Version desktop
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 w-64 border-r",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      {renderNavigationContent()}

      <Button
        variant="ghost"
        className="absolute bottom-4 left-4 right-4"
        onClick={() => setShowProfilePreview(true)}
      >
        <User className="h-4 w-4 mr-2" />
        <span>Profil</span>
      </Button>

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
