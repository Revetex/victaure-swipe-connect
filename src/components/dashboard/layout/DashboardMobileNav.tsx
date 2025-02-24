import { Logo } from "@/components/Logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  return <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      
    </Sheet>;
}