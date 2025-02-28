
import { useAuth } from "@/hooks/useAuth";
import { ContentRouter } from "./ContentRouter";
import { DashboardHome } from "./DashboardHome";
import { FloatingButtons } from "./FloatingButtons";
import { LoadingState } from "./LoadingState";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

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
  
  if (isLoading || !user) {
    return <LoadingState />;
  }
  
  const renderDashboardHome = () => <DashboardHome onRequestChat={onRequestChat} />;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 sm:px-6 py-6 min-h-screen bg-gradient-to-b from-background/80 via-background to-background/90"
      >
        <div className="grid grid-cols-1 gap-4">
          <motion.div 
            className="space-y-4" 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden bg-card/80 border-border/30 backdrop-blur-sm hover:bg-card/90 transition-colors duration-300 shadow-sm">
              <div className="relative p-4">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                
                <ContentRouter 
                  currentPage={currentPage} 
                  onEditStateChange={onEditStateChange} 
                  onRequestChat={onRequestChat} 
                  renderDashboardHome={renderDashboardHome} 
                />
                
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              </div>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FloatingButtons />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
