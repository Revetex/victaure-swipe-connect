
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FriendRequestsSection } from "./FriendRequestsSection";

interface PendingRequestsSectionProps {
  showPendingRequests: boolean;
  onToggle: () => void;
}

export function PendingRequestsSection({ 
  showPendingRequests, 
  onToggle 
}: PendingRequestsSectionProps) {
  return (
    <motion.div 
      className="bg-muted/20 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden border border-border/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full flex items-center justify-between p-3",
          "hover:bg-accent/5 transition-colors duration-300",
          "font-medium tracking-tight"
        )}
        onClick={onToggle}
      >
        <span className="text-sm bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70 bg-clip-text text-transparent">
          Demandes en attente
        </span>
        {showPendingRequests ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      <AnimatePresence>
        {showPendingRequests && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">
              <FriendRequestsSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
