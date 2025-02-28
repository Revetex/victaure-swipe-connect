import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useViewport } from "@/hooks/useViewport";
import { LoadingState } from "./content/LoadingState";
import { FloatingButtons } from "./content/FloatingButtons";
import { ContentRouter } from "./content/ContentRouter";
import { DashboardHome } from "./content/DashboardHome";
import { cn } from "@/lib/utils";
interface DashboardContentProps {
  currentPage: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}
export function DashboardContent({
  currentPage,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const {
    user
  } = useAuth();
  const {
    width
  } = useViewport();
  const isMobile = width < 768;
  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);
  if (!user) {
    return <LoadingState />;
  }
  const renderDashboardHome = () => {
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4
    }}>
        <DashboardHome onRequestChat={onRequestChat} />
      </motion.div>;
  };
  return <div className="min-h-screen bg-transparent">
      <div className="relative z-10">
        <ContentRouter currentPage={currentPage} onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} renderDashboardHome={renderDashboardHome} />

        {!isMobile && <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.6,
        duration: 0.3
      }}>
            <FloatingButtons />
          </motion.div>}
      </div>

      {/* Effet de points en arrière-plan amélioré */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
      backgroundImage: 'radial-gradient(circle, rgba(100,181,217,0.05) 1px, transparent 1px), radial-gradient(circle, rgba(155,135,245,0.03) 2px, transparent 2px)',
      backgroundSize: '30px 30px, 60px 60px',
      backgroundPosition: '0 0, 15px 15px'
    }} />
    </div>;
}