import { TodoList } from "@/components/TodoList";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { VCard } from "@/components/VCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const pages = [
  {
    component: <Messages />,
    title: "Messages & Notifications",
    color: "from-primary/5 to-primary/10"
  },
  {
    component: (
      <div className="space-y-4">
        <SwipeJob />
        <VCard />
      </div>
    ),
    title: "Offres & Profil",
    color: "from-primary/10 to-primary/15"
  },
  {
    component: <TodoList />,
    title: "Tâches & Notes",
    color: "from-primary/15 to-primary/20"
  }
];

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

  const handleSwipe = (direction: number) => {
    let newPage = currentPage + direction;
    if (newPage < 0) newPage = totalPages - 1;
    if (newPage >= totalPages) newPage = 0;
    setCurrentPage(newPage);
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
          className="h-full w-full flex flex-col"
        >
          <motion.header 
            className="flex items-center justify-between p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1 
              className="text-xl font-bold"
              layout
            >
              {pages[currentPage].title}
            </motion.h1>
            
            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSwipe(-1)}
                className="hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-1.5">
                {pages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      currentPage === index 
                        ? "w-5 bg-primary" 
                        : "w-2.5 bg-primary/20"
                    )}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: currentPage === index ? 1 : 0.8,
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSwipe(1)}
                className="hover:bg-primary/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </nav>
          </motion.header>
          
          <motion.main 
            className={cn(
              "flex-1 m-4 rounded-xl overflow-hidden bg-gradient-to-br shadow-lg",
              pages[currentPage].color
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-full overflow-auto p-4">
              {pages[currentPage].component}
            </div>
          </motion.main>
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0 z-10"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as any).touchStartX = touch.clientX;
          (e.currentTarget as any).touchStartY = touch.clientY;
          (e.currentTarget as any).touchStartTime = Date.now();
        }}
        onTouchEnd={(e) => {
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - (e.currentTarget as any).touchStartX;
          const deltaY = touch.clientY - (e.currentTarget as any).touchStartY;
          const deltaTime = Date.now() - (e.currentTarget as any).touchStartTime;
          
          // Vérifier si le mouvement est plus horizontal que vertical
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const velocity = Math.abs(deltaX) / deltaTime;
            
            if (Math.abs(deltaX) > 50 || (Math.abs(deltaX) > 20 && velocity > 0.5)) {
              handleSwipe(deltaX > 0 ? -1 : 1);
            }
          }
        }}
      />
    </div>
  );
}