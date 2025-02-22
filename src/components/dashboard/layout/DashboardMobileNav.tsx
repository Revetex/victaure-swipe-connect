
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

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
  onPageChange
}: DashboardMobileNavProps) {
  return (
    <div className="lg:hidden fixed top-4 left-4 z-50">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 bg-[#64B5D9] border-2 border-black/40">
          <div className="p-4">
            <Logo />
          </div>
          <nav className="space-y-1 p-4">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.id} 
                  onClick={() => {
                    onPageChange(item.id);
                    setShowMobileMenu(false);
                  }} 
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                    "transition-colors border-2",
                    currentPage === item.id 
                      ? "bg-white/15 text-white font-medium border-white/40" 
                      : "text-white/80 hover:bg-white/10 hover:text-white border-white/20"
                  )} 
                  title={item.name} 
                  aria-label={`Naviguer vers ${item.name}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
