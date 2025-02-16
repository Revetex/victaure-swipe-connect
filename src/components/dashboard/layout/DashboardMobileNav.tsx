
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardMobileNavProps {
  currentPage: number;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  onPageChange: (page: number) => void;
}

export function DashboardMobileNav({
  currentPage,
  showMobileMenu,
  setShowMobileMenu,
  onPageChange,
}: DashboardMobileNavProps) {
  const handlePageChange = (pageId: number) => {
    onPageChange(pageId);
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="lg:hidden flex items-center justify-between px-4 h-16 border-b z-50 bg-background/95 backdrop-blur-sm sticky top-0">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 lg:hidden"
            style={{ top: "64px" }}
          >
            <ScrollArea className="h-[calc(100vh-64px)]">
              <div className="container py-6 grid gap-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 h-12",
                        currentPage === item.id &&
                          "bg-primary/10 text-primary font-medium"
                      )}
                      onClick={() => handlePageChange(item.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
