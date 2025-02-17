
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ChevronLeft, Menu, Layout, MessageCircle, BriefCase, Settings, Users, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardSidebar({ currentPage, onPageChange }: DashboardSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 h-full w-64 border-r",
      "hidden lg:block",
      "bg-background/80 backdrop-blur-sm",
      "supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-6">
          <nav className="grid gap-2 px-4">
            <Button
              variant={currentPage === 1 ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                "data-[state=open]:bg-muted"
              )}
              onClick={() => onPageChange(1)}
            >
              <Layout className="h-5 w-5" />
              Tableau de bord
            </Button>

            <Button
              variant={currentPage === 2 ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                "data-[state=open]:bg-muted"
              )}
              onClick={() => onPageChange(2)}
            >
              <MessageCircle className="h-5 w-5" />
              Messages
            </Button>

            <Button
              variant={currentPage === 3 ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                "data-[state=open]:bg-muted"
              )}
              onClick={() => onPageChange(3)}
            >
              <BriefCase className="h-5 w-5" />
              Emplois
            </Button>

            <Button
              variant={currentPage === 4 ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                "data-[state=open]:bg-muted"
              )}
              onClick={() => onPageChange(4)}
            >
              <ShoppingBag className="h-5 w-5" />
              Marketplace
            </Button>

            <Button
              variant={currentPage === 5 ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                "data-[state=open]:bg-muted"
              )}
              onClick={() => onPageChange(5)}
            >
              <Users className="h-5 w-5" />
              Amis
            </Button>

            <Button
              variant={currentPage === 6 ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                "data-[state=open]:bg-muted"
              )}
              onClick={() => onPageChange(6)}
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </Button>
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
