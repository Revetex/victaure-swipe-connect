import { TodoList } from "@/components/TodoList";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { VCard } from "@/components/VCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3;

  const handleSwipe = (direction: number) => {
    let newPage = currentPage + direction;
    if (newPage < 0) newPage = totalPages - 1;
    if (newPage >= totalPages) newPage = 0;
    setCurrentPage(newPage);
  };

  const pages = [
    {
      component: <Messages />,
      title: "Messages & Notifications",
      color: "bg-primary/5"
    },
    {
      component: (
        <div className="space-y-4">
          <SwipeJob />
          <VCard />
        </div>
      ),
      title: "Offres & Profil",
      color: "bg-primary/10"
    },
    {
      component: <TodoList />,
      title: "Tâches & Notes",
      color: "bg-primary/15"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="h-screen w-screen"
        >
          <div className="container mx-auto px-4 py-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold"
              >
                {pages[currentPage].title}
              </motion.h1>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSwipe(-1)}
                  className="hover:bg-primary/10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-1">
                  {pages.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: currentPage === index ? 1 : 0.8,
                        backgroundColor: currentPage === index ? "var(--primary)" : "var(--primary-light)"
                      }}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        currentPage === index
                          ? "bg-primary"
                          : "bg-primary/20"
                      }`}
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
              </div>
            </div>
            
            <motion.div 
              className={`flex-1 glass-card rounded-lg overflow-hidden ${pages[currentPage].color}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {pages[currentPage].component}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Touch swipe handlers with improved sensitivity */}
      <div
        className="absolute inset-0 z-10"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as any).touchStartX = touch.clientX;
          (e.currentTarget as any).touchStartTime = Date.now();
        }}
        onTouchEnd={(e) => {
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - (e.currentTarget as any).touchStartX;
          const deltaTime = Date.now() - (e.currentTarget as any).touchStartTime;
          
          // Calculate swipe velocity
          const velocity = Math.abs(deltaX) / deltaTime;
          
          // Adjust sensitivity based on velocity and distance
          if (Math.abs(deltaX) > 50 || (Math.abs(deltaX) > 20 && velocity > 0.5)) {
            handleSwipe(deltaX > 0 ? -1 : 1);
          }
        }}
      />
    </div>
  );
}