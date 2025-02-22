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
  return <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur shadow-sm">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        

        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <Logo />
          </div>
          <nav className="space-y-1 p-4" role="navigation" aria-label="Menu principal">
            {navigationItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => {
              onPageChange(item.id);
              setShowMobileMenu(false);
            }} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm", "transition-colors", currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")} aria-label={item.name} title={item.name}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </button>;
          })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>;
}