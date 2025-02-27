
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
  
  if (isLoading || !user) {
    return <LoadingState />;
  }
  
  const renderDashboardHome = () => <DashboardHome onRequestChat={onRequestChat} />;
  
  return <AnimatePresence mode="wait">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -20
    }} className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-gradient-to-b from-background/50 via-background to-background/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section principale avec un fond subtil */}
          <motion.div className="lg:col-span-8 space-y-6" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.2
        }}>
            <Card className="overflow-hidden bg-black/40 border-zinc-800/50 backdrop-blur-sm hover:bg-black/50 transition-colors duration-300">
              <div className="relative">
                {/* Effet de gradient subtil sur le bord supérieur */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                <ContentRouter currentPage={currentPage} onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} renderDashboardHome={renderDashboardHome} />
                
                {/* Effet de gradient subtil sur le bord inférieur */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>
            </Card>
          </motion.div>

          {/* Barre latérale avec effet de verre */}
          <motion.div className="lg:col-span-4 space-y-6" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.3
        }}>
            <Card className="p-6 bg-black/40 border-zinc-800/50 backdrop-blur-sm hover:bg-black/50 transition-colors duration-300 py-[15px] px-[15px]">
              <DashboardFriendsList />
            </Card>

            <FloatingButtons />
          </motion.div>
        </div>

        {/* Effet de grain subtil sur tout le dashboard */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay'
      }} />
      </motion.div>
    </AnimatePresence>;
}
