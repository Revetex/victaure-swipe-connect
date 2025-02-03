import { motion } from "framer-motion";
import { Settings } from "@/components/Settings";
import { Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ProfileSection } from "./sections/ProfileSection";
import { MessagesSection } from "./sections/MessagesSection";
import { JobsSection } from "./sections/JobsSection";
import { FeedSection } from "./sections/FeedSection";
import { ToolsSection } from "./sections/ToolsSection";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return <ProfileSection onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
      case 2:
        return <MessagesSection />;
      case 3:
        return <JobsSection />;
      case 4:
        return <FeedSection />;
      case 5:
        return <ToolsSection />;
      case 6:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Paramètres</h2>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
                    <Info className="h-4 w-4 text-primary" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-sm text-muted-foreground">
                    Personnalisez votre expérience et gérez vos préférences.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Settings />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full min-h-screen pb-20",
        "bg-gradient-to-br from-background via-background/95 to-background/90"
      )}
    >
      <div className="container mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </motion.div>
  );
}