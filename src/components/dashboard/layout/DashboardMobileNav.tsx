
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
  const mainItems = navigationItems.slice(0, 6);
  const networkItems = navigationItems.slice(6, 8);
  const toolsItems = navigationItems.slice(8);

  return (
    <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      <SheetContent 
        side="left" 
        className={cn(
          "w-[280px] p-0",
          "bg-[#1A1F2C]",
          "border-2 border-white/10",
          "fixed inset-y-0 left-0",
          "lg:hidden",
          "z-[150]",
          "overflow-y-auto pb-20",
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
        <div className="p-4 border-b border-white/10 bg-white/5 relative z-10">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 relative z-10">
          {/* Section principale */}
          <div className="space-y-1">
            {mainItems.map(item => {
              const Icon = item.icon;
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
                    "border-2",
                    currentPage === item.id 
                      ? "bg-white/15 text-white border-white/20" 
                      : "text-white/80 hover:bg-white/10 hover:text-white border-transparent hover:border-white/10"
                  )} 
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Section réseau */}
          <div className="space-y-1">
            <div className="px-2 py-0.5 text-xs font-semibold text-white/60 uppercase tracking-wider">
              Réseau
            </div>
            {networkItems.map(item => {
              const Icon = item.icon;
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
                    "border-2",
                    currentPage === item.id 
                      ? "bg-white/15 text-white border-white/20" 
                      : "text-white/80 hover:bg-white/10 hover:text-white border-transparent hover:border-white/10"
                  )} 
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Section outils */}
          <div className="space-y-1">
            <div className="px-2 py-0.5 text-xs font-semibold text-white/60 uppercase tracking-wider">
              Outils
            </div>
            {toolsItems.map(item => {
              const Icon = item.icon;
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
                    "border-2",
                    currentPage === item.id 
                      ? "bg-white/15 text-white border-white/20" 
                      : "text-white/80 hover:bg-white/10 hover:text-white border-transparent hover:border-white/10"
                  )} 
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
