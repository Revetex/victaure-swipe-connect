
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
  return (
    <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      <SheetContent 
        side="left" 
        className={cn(
          "w-[280px] p-0",
          "bg-gradient-to-br from-[#1A1F2C] to-[#1B2A4A]",
          "border border-[#9b87f5]/20",
          "fixed inset-y-0 left-0",
          "lg:block",
          "z-[150]",
          "overflow-y-auto pb-20",
          "ios-momentum-scroll ios-safe-area"
        )}
      >
        {/* Motif de fond */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(155, 135, 245, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* En-tête avec logo */}
        <div className="p-4 border-b border-[#9b87f5]/20 bg-[#9b87f5]/5 relative z-10">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4 relative z-10">
          {navigationItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button 
                key={item.id} 
                onClick={() => {
                  onPageChange(item.id);
                  setShowMobileMenu(false);
                }} 
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5",
                  "rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  "mobile-friendly-button",
                  currentPage === item.id 
                    ? "bg-[#9b87f5]/20 text-white border border-[#9b87f5]/30" 
                    : "text-white/90 hover:bg-[#9b87f5]/10 hover:text-white border border-transparent hover:border-[#9b87f5]/20"
                )} 
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
