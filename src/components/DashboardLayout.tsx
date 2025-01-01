import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Bot, MessageSquare, BriefcaseIcon, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showMVictor, setShowMVictor] = useState(true);

  const handleSwipe = (direction: number) => {
    if (isEditing) return;
    let newPage = currentPage + direction;
    if (newPage < 1) newPage = 3;
    if (newPage > 3) newPage = 1;
    setCurrentPage(newPage);
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

  const getPageIcon = (page: number) => {
    switch (page) {
      case 1:
        return <UserCircle className="h-4 w-4" />;
      case 2:
        return <MessageSquare className="h-4 w-4" />;
      case 3:
        return <BriefcaseIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPageName = (page: number) => {
    switch (page) {
      case 1:
        return "Profil";
      case 2:
        return "M. Victor";
      case 3:
        return "Emplois";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      {showMVictor && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-20 right-4 z-50"
        >
          <Card className="p-6 max-w-sm bg-white/95 backdrop-blur-sm shadow-lg border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2 rounded-full bg-primary/10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h3 className="font-semibold">M. Victor</h3>
                <p className="text-sm text-muted-foreground">Assistant virtuel</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Bonjour ! Je suis M. Victor, votre assistant virtuel de placement professionnel. Je peux vous aider à :
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Optimiser votre profil</li>
                <li>Trouver des opportunités</li>
                <li>Gérer vos candidatures</li>
              </ul>
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMVictor(false)}
              >
                Plus tard
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setCurrentPage(2);
                  setShowMVictor(false);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Discuter
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="relative z-10 flex-1 overflow-hidden">
        {!isEditing && (
          <>
            <div className="absolute top-1/2 left-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => handleSwipe(-1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => handleSwipe(1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </>
        )}

        <div className="container mx-auto px-4 h-full py-6">
          <motion.div 
            className="h-full max-w-[1200px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPage === 1 && (
              <div className={isEditing ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 overflow-auto" : ""}>
                {renderDashboardSection(
                  <VCard onEditStateChange={setIsEditing} />,
                  'w-full h-full'
                )}
              </div>
            )}
            
            {currentPage === 2 && !isEditing && renderDashboardSection(
              <Messages />,
              'w-full h-full'
            )}
            
            {currentPage === 3 && !isEditing && renderDashboardSection(
              <SwipeJob />,
              'w-full h-full',
              false
            )}
          </motion.div>
        </div>

        {!isEditing && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentPage === page 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background/80 hover:bg-background/90 backdrop-blur-sm'
                }`}
              >
                {getPageIcon(page)}
                <span className="text-sm font-medium">{getPageName(page)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}