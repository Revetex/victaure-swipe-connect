import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Menu, Coins } from "lucide-react";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { PricingGrid } from "@/components/pricing/PricingGrid";
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
  return <div className="lg:hidden fixed top-4 left-4 z-50">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0 bg-[#64B5D9] border-2 border-black relative overflow-hidden">
          {/* Motif de fond */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url('/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png')`,
          backgroundSize: '150px',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat'
        }} />

          <div className="p-4 border-b-2 border-black bg-black/5">
            <Logo />
          </div>

          <nav className="space-y-1.5 p-4 relative z-10">
            {navigationItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => {
              onPageChange(item.id);
              setShowMobileMenu(false);
            }} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm", "transition-all duration-200 border-2 shadow-sm", currentPage === item.id ? "bg-white/15 text-white font-medium border-black shadow-inner" : "text-white/90 hover:bg-white/10 hover:text-white border-black/20 hover:border-black")}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="font-medium">{item.name}</span>
                </button>;
          })}

            {/* Bouton Tarifs */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                    transition-all duration-200 border-2 shadow-sm
                    bg-white/10 text-white font-medium border-black hover:bg-white/15">
                  <Coins className="h-3.5 w-3.5" />
                  <span className="font-medium">Voir les tarifs</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto bg-[#1B2A4A] border-2 border-black">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Tarifs Victaure 2024
                  </h2>
                  <PricingGrid />
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </SheetContent>
      </Sheet>
    </div>;
}