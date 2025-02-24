
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
          "bg-[#1B2A4A]",
          "border-2 border-black",
          "fixed inset-y-0 left-0",
          "lg:block",
          "z-[150]",
          "overflow-y-auto pb-20", // Ajout du padding-bottom et overflow
          "ios-momentum-scroll ios-safe-area"
        )}
      >
        {/* Motif de fond */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url('/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png')`,
            backgroundSize: '150px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* En-tête avec logo */}
        <div className="p-4 border-b-2 border-black bg-black/5 relative z-10">
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
                  "border-2 shadow-sm",
                  "mobile-friendly-button",
                  currentPage === item.id 
                    ? "bg-white/15 text-white border-black shadow-inner" 
                    : "text-white/90 hover:bg-white/10 hover:text-white border-black/20 hover:border-black"
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
