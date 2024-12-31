import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
    toast.error("La vidéo n'a pas pu être chargée");
    console.error("Video loading error: Video file not found");
  };

  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div 
      variants={itemVariants} 
      className={`transform transition-all duration-300 ${className}`}
    >
      <div className="dashboard-card h-full">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 h-full overflow-hidden">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-2 sm:py-4">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-[2000px]">
          <motion.div 
            className="flex flex-col gap-6 sm:gap-8 md:gap-12 max-w-[1200px] mx-auto pb-24 sm:pb-32 md:pb-40"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section with Notes, Tasks, and Settings */}
            {renderDashboardSection(
              <Messages />,
              'w-full h-[600px] sm:h-[700px] md:h-[800px]'
            )}

            {/* Victaure Promotional Video */}
            {renderDashboardSection(
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                {!videoError ? (
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    loop
                    onError={handleVideoError}
                  >
                    <source src="/lovable-uploads/VictaurePub – Réalisée avec Clipchamp.mp4" type="video/mp4" />
                    Votre navigateur ne prend pas en charge la lecture de vidéos.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    <p>La vidéo n'est pas disponible pour le moment</p>
                  </div>
                )}
              </div>,
              'w-full'
            )}

            {/* SwipeJob Section */}
            {renderDashboardSection(
              <SwipeJob />,
              'w-full h-[500px] sm:h-[550px] md:h-[600px]',
              false
            )}

            {/* VCard Section */}
            {renderDashboardSection(
              <VCard />,
              'w-full h-[500px] sm:h-[550px] md:h-[600px]'
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}