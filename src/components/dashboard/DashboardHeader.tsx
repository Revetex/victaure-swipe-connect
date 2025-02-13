
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FeedSidebar } from "../feed/FeedSidebar";
import { UserNav } from "./layout/UserNav";
import { Suspense } from "react";
import { ProfileSection } from "./layout/sidebar/ProfileSection";
import { useProfile } from "@/hooks/useProfile";
import { Navigation } from "@/components/Navigation";

export interface DashboardHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
  onToolReturn?: () => void;
}

export function DashboardHeader({
  title,
  showFriendsList,
  onToggleFriendsList,
  isEditing
}: DashboardHeaderProps) {
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  return (
    <div className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      {/* En-tête principal */}
      <div className="flex items-center justify-between p-4 max-w-[2000px] mx-auto">
        <motion.div 
          className="flex items-center gap-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
              <Suspense fallback={null}>
                <FeedSidebar />
              </Suspense>
            </SheetContent>
          </Sheet>
          <Logo size="lg" />
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 sm:gap-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <NotificationsBox />
          <UserNav />
          {profile && (
            <ProfileSection
              profile={profile}
              showProfilePreview={showProfilePreview}
              onProfileClick={() => setShowProfilePreview(true)}
              onClosePreview={() => setShowProfilePreview(false)}
            />
          )}
          {!isEditing && (
            <Button
              variant="outline"
              onClick={onToggleFriendsList}
              className={`
                flex items-center gap-2 text-sm sm:text-base
                transition-all duration-300
                hover:bg-primary/10 hover:text-primary
                ${showFriendsList ? 'bg-primary/5 text-primary' : ''}
              `}
              size="sm"
            >
              <MenuIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Amis</span>
            </Button>
          )}
        </motion.div>
      </div>

      {/* Menu de navigation en bas du header */}
      <div className="border-t border-border/50">
        <div className="max-w-[2000px] mx-auto px-4">
          <Navigation
            className="flex items-center justify-start gap-4 py-2 overflow-x-auto"
            orientation="horizontal"
          />
        </div>
      </div>
    </div>
  );
}
