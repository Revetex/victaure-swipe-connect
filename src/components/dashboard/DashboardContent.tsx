
import { useAuth } from "@/hooks/useAuth";
import { ContentRouter } from "./content/ContentRouter";
import { DashboardHome } from "./content/DashboardHome";
import { FloatingButtons } from "./content/FloatingButtons";
import { LoadingState } from "./content/LoadingState";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useThemeContext } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

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
  const { themeStyle, isDark } = useThemeContext();

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
        className={cn(
          "container mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen",
          "bg-gradient-to-b from-transparent to-transparent",
          `theme-${themeStyle}`
        )}
      >
        <div className="space-y-6">
          {/* Main content section */}
          <motion.div 
            className="space-y-6" 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={cn(
              "backdrop-blur-md border rounded-xl shadow-sm",
              isDark 
                ? "bg-black/30 border-white/10" 
                : "bg-white/5 border-white/20"
            )}>
              <div className="relative">
                {/* Subtle gradient border at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                
                <ContentRouter 
                  currentPage={currentPage} 
                  onEditStateChange={onEditStateChange} 
                  onRequestChat={onRequestChat} 
                  renderDashboardHome={renderDashboardHome} 
                />
                
                {/* Subtle gradient border at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              </div>
            </Card>
          </motion.div>

          {/* Floating buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FloatingButtons />
          </motion.div>
        </div>

        {/* Subtle grain texture overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.02]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
