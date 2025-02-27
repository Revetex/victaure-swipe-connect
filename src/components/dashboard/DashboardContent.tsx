
import { useAuth } from "@/hooks/useAuth";
import { ContentRouter } from "./content/ContentRouter";
import { DashboardHome } from "./content/DashboardHome";
import { DashboardFriendsList } from "./content/DashboardFriendsList";
import { FloatingButtons } from "./content/FloatingButtons";
import { LoadingState } from "./content/LoadingState";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface DashboardContentProps {
  currentPage?: number;
  isEditing?: boolean;
  onEditStateChange?: (state: boolean) => void;
  onRequestChat?: () => void;
}

export function DashboardContent({ 
  currentPage = 0,
  isEditing = false,
  onEditStateChange = () => {},
  onRequestChat = () => {}
}: DashboardContentProps) {
  const { isLoading, user } = useAuth();
  const [showFriendsList, setShowFriendsList] = useState(true);
  
  if (isLoading || !user) {
    return <LoadingState />;
  }

  const renderDashboardHome = () => (
    <DashboardHome onRequestChat={onRequestChat} />
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 py-6 min-h-screen"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section principale */}
          <motion.div 
            className="lg:col-span-8 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-black/40 border-zinc-800/50 backdrop-blur-sm">
              {currentPage === 0 ? (
                <DashboardHome onRequestChat={onRequestChat} />
              ) : null}
            </Card>

            <Card className="overflow-hidden bg-black/40 border-zinc-800/50 backdrop-blur-sm">
              <ContentRouter 
                currentPage={currentPage}
                onEditStateChange={onEditStateChange}
                onRequestChat={onRequestChat}
                renderDashboardHome={renderDashboardHome}
              />
            </Card>
          </motion.div>

          {/* Barre latérale */}
          <motion.div 
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-black/40 border-zinc-800/50 backdrop-blur-sm">
              <DashboardFriendsList 
                show={showFriendsList}
                onClose={() => setShowFriendsList(false)}
              />
            </Card>

            <FloatingButtons />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
