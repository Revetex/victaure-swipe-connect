
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./header/AppHeader";
import { AppSidebar } from "./AppSidebar";
import { AppFooter } from "./footer/AppFooter";
import { useThemeContext } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { isDark } = useThemeContext();
  const { isAuthenticated } = useAuth();

  // Appliquer des classes dynamiques au body selon le thème
  useEffect(() => {
    document.body.className = isDark ? "dark" : "";
    document.body.classList.add("dashboard-layout");
  }, [isDark]);

  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-gradient-to-br from-[#1B2A4A]/80 via-[#1A1F2C] to-[#1B2A4A]/80">
      {isAuthenticated && <AppSidebar />}
      
      <div className="flex flex-col w-full min-h-screen">
        <AppHeader />
        
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex-1 w-full px-4 pt-4 pb-16 md:px-6 overflow-x-hidden",
            "relative z-10"
          )}
        >
          <Outlet />
        </motion.main>
        
        <AppFooter />
        
        {/* Effet de grain pour ajouter de la texture */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.015] z-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
    </div>
  );
}
