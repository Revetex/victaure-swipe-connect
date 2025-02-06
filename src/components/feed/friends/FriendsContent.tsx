import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { ConnectionsSection } from "./ConnectionsSection";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="relative"
        variants={itemVariants}
      >
        <ProfileSearch 
          onSelect={setSelectedProfile}
          placeholder="Rechercher un contact..."
          className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        />
        <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Gérez vos connections et demandes d'amis</span>
        </div>

        <Separator className="bg-border/40" />

        <Collapsible
          open={isRequestsOpen}
          onOpenChange={setIsRequestsOpen}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-full flex justify-between hover:bg-accent/50",
                "transition-all duration-200",
                isRequestsOpen && "bg-accent/50"
              )}
            >
              <span className="font-medium">Demandes en attente</span>
              <motion.div
                animate={{ rotate: isRequestsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <motion.div 
              className="pl-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FriendRequestsSection />
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
        
        <motion.div variants={itemVariants}>
          <ConnectionsSection />
        </motion.div>
      </motion.div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </motion.div>
  );
}