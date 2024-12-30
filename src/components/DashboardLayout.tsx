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
      title: "Messages & Notifications"
    },
    {
      component: (
        <div className="space-y-4">
          <SwipeJob />
          <VCard />
        </div>
      ),
      title: "Offres & Profil"
    },
    {
      component: <TodoList />,
      title: "Tâches & Notes"
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-screen w-screen"
        >
          <div className="container mx-auto px-4 py-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">{pages[currentPage].title}</h1>
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
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
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
            
            <div className="flex-1 glass-card rounded-lg overflow-hidden">
              {pages[currentPage].component}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Touch swipe handlers */}
      <div
        className="absolute inset-0 z-10"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as any).touchStartX = touch.clientX;
        }}
        onTouchEnd={(e) => {
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - (e.currentTarget as any).touchStartX;
          if (Math.abs(deltaX) > 50) {
            handleSwipe(deltaX > 0 ? -1 : 1);
          }
        }}
      />
    </div>
  );
}